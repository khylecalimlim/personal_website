import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from './theme.service';

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
const SPARK_GLYPHS   = ['✦', '✧', '★', '✷', '✺'];
const SPARK_COLORS   = ['#5b8dee', '#f5d76e', '#e8e8e8', '#9b8cf2'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  theme = inject(ThemeService);
  settingsOpen = false;
  navCollapsed = false;

  // Click-anywhere star/spark burst — purely decorative, in the same
  // playful spirit as the home page particle background and easter eggs.
  // TODO: add a settings option to change/alter the click spark animation
  // (e.g. glyphs, colors, intensity, or disable entirely).
  sparks = signal<Spark[]>([]);
  private nextSparkId = 0;

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
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
        glyph: SPARK_GLYPHS[Math.floor(Math.random() * SPARK_GLYPHS.length)],
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
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
}
