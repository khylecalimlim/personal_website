import {
  AfterViewInit, Component, ElementRef, HostListener,
  inject, OnDestroy, signal, ViewChild
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../theme.service';

const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a'
];

const PARTICLE_COUNT = 80;
const MAX_DIST       = 130;
const SPEED          = 0.4;
const MOUSE_RADIUS   = 120;
const MOUSE_FORCE    = 2.5;

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  theme = inject(ThemeService);
  easterEggActive = signal(false);
  private keyBuffer: string[] = [];

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: -9999, y: -9999 };
  private rafId = 0;
  private resizeObserver!: ResizeObserver;

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.spawnParticles();
    this.animate();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement!);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
  }

  // ── Canvas setup ───────────────────────────────────────────────────────────

  private resize() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  private spawnParticles() {
    const { width, height } = this.canvasRef.nativeElement;
    this.particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * SPEED * 2,
      vy: (Math.random() - 0.5) * SPEED * 2,
      radius: Math.random() * 1.5 + 1
    }));
  }

  private animate() {
    const canvas = this.canvasRef.nativeElement;
    const { width, height } = canvas;
    this.ctx.clearRect(0, 0, width, height);

    for (const p of this.particles) {
      // Mouse repulsion
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * MOUSE_FORCE;
        p.vx += (dx / dist) * force * 0.05;
        p.vy += (dy / dist) * force * 0.05;
      }

      // Dampen so particles don't accelerate forever
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Clamp speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > SPEED * 3) { p.vx = p.vx / speed * SPEED * 3; p.vy = p.vy / speed * SPEED * 3; }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(91, 141, 238, 0.55)';
      this.ctx.fill();
    }

    // Draw connection lines
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `rgba(91, 141, 238, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  // ── Event listeners ────────────────────────────────────────────────────────

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const rect = this.canvasRef?.nativeElement.getBoundingClientRect();
    if (rect) {
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    }
  }

  @HostListener('window:mouseleave')
  onMouseLeave() { this.mouse = { x: -9999, y: -9999 }; }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    this.keyBuffer.push(e.key);
    if (this.keyBuffer.length > KONAMI.length) this.keyBuffer.shift();
    if (this.keyBuffer.join() === KONAMI.join()) {
      this.easterEggActive.set(true);
      this.keyBuffer = [];
    }
  }

  private tapCount = 0;
  private tapTimer: ReturnType<typeof setTimeout> | null = null;

  onNameTap() {
    this.tapCount++;
    if (this.tapTimer) clearTimeout(this.tapTimer);
    if (this.tapCount >= 7) {
      this.easterEggActive.set(true);
      this.tapCount = 0;
      return;
    }
    this.tapTimer = setTimeout(() => { this.tapCount = 0; }, 1500);
  }

  dismissEasterEgg() {
    this.easterEggActive.set(false);
  }
}
