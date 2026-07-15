import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SPARK_PRESETS, ThemeService } from './theme.service';

interface Spark {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotation: number;
  size: number;
  glyph: string;
  color: string;
}

const SPARK_COUNT    = 6;
const SPARK_LIFETIME = 650; // ms — must match the CSS animation duration
const AWAY_TITLE     = '👋 come back!';

const TRAIL_LIFETIME     = 500; // ms — must match the CSS trail animation duration
const TRAIL_MIN_DISTANCE = 18;  // px between pointer moves before spawning another trail dot

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
// TODO: only the Home page has a fun easter egg (the particle background +
// Konami code in home.component.ts). Add something playful to the other pages
// (About, Projects, Resume, Feedback, Command Center) too. Idea: a small
// dog/animal sprite that runs away from the cursor - could reuse the home
// page's particle approach (canvas + mouse-position repulsion, see
// MOUSE_RADIUS/MOUSE_FORCE in home.component.ts) but driven by a single
// sprite instead of 80 particles, or go further with custom "animal-like"
// movement (e.g. dart away in bursts, pause/look around, easing instead of
// constant repulsion) to sell the illusion of a living creature rather than
// a physics object. Since it's global (not page-specific), this probably
// belongs in AppComponent like the click sparks, gated by its own settings
// toggle.
export class AppComponent {
  theme = inject(ThemeService);
  settingsOpen = false;
  navCollapsed = false;

  private readonly originalTitle = document.title;

  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    document.title = document.hidden ? AWAY_TITLE : this.originalTitle;
  }

  // Click-anywhere star/spark burst — purely decorative, in the same
  // playful spirit as the home page particle background and easter eggs.
  // Can be toggled off via the "Enable click sparks" setting.
  sparks = signal<Spark[]>([]);
  private nextSparkId = 0;

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    if (!this.theme.clickSparksEnabled()) return;

    const preset = SPARK_PRESETS[this.theme.sparkPreset()];
    const burst: Spark[] = Array.from({ length: SPARK_COUNT }, () => {
      const angle    = Math.random() * Math.PI * 2;
      const distance = 28 + Math.random() * 42;
      return {
        id: this.nextSparkId++,
        x: e.clientX,
        y: e.clientY,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        rotation: (Math.random() - 0.5) * 360,
        size: 10 + Math.random() * 10,
        glyph: preset.glyphs[Math.floor(Math.random() * preset.glyphs.length)],
        color: preset.colors[Math.floor(Math.random() * preset.colors.length)],
      };
    });

    this.sparks.update(s => [...s, ...burst]);

    // Sweep this burst out once its animation finishes — keeps the signal's
    // array from growing unbounded across a session of clicking around.
    const ids = new Set(burst.map(s => s.id));
    setTimeout(() => {
      this.sparks.update(s => s.filter(spark => !ids.has(spark.id)));
    }, SPARK_LIFETIME);
  }

  // Cursor trail — reuses the same Spark shape/preset system as the click
  // burst above, but drops a single lighter/lower-opacity glyph as the
  // pointer moves instead of a radial burst on click. Throttled by distance
  // (TRAIL_MIN_DISTANCE) rather than time so a fast swipe still gets a
  // continuous trail while a slow drift doesn't spam glyphs.
  trail = signal<Spark[]>([]);
  private nextTrailId = 0;
  private lastTrailX = 0;
  private lastTrailY = 0;

  @HostListener('document:pointermove', ['$event'])
  onDocumentPointerMove(e: PointerEvent) {
    if (!this.theme.cursorTrailEnabled()) return;

    const dx = e.clientX - this.lastTrailX;
    const dy = e.clientY - this.lastTrailY;
    if (Math.hypot(dx, dy) < TRAIL_MIN_DISTANCE) return;
    this.lastTrailX = e.clientX;
    this.lastTrailY = e.clientY;

    const preset = SPARK_PRESETS[this.theme.sparkPreset()];
    const dot: Spark = {
      id: this.nextTrailId++,
      x: e.clientX,
      y: e.clientY,
      dx: 0,
      dy: 0,
      rotation: (Math.random() - 0.5) * 180,
      size: 8 + Math.random() * 6,
      glyph: preset.glyphs[Math.floor(Math.random() * preset.glyphs.length)],
      color: preset.colors[Math.floor(Math.random() * preset.colors.length)],
    };

    this.trail.update(t => [...t, dot]);

    const id = dot.id;
    setTimeout(() => {
      this.trail.update(t => t.filter(spark => spark.id !== id));
    }, TRAIL_LIFETIME);
  }
}
