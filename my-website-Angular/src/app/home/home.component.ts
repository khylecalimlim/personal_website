import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../theme.service';

const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a'
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  theme = inject(ThemeService);
  easterEggActive = signal(false);
  private keyBuffer: string[] = [];

  private tapCount = 0;
  private tapTimer: ReturnType<typeof setTimeout> | null = null;

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    this.keyBuffer.push(e.key);
    if (this.keyBuffer.length > KONAMI.length) this.keyBuffer.shift();
    if (this.keyBuffer.join() === KONAMI.join()) {
      this.easterEggActive.set(true);
      this.keyBuffer = [];
    }
  }

  onNameTap() {
    this.tapCount++;
    if (this.tapTimer) clearTimeout(this.tapTimer);
    if (this.tapCount >= 7) {
      this.easterEggActive.set(true);
      this.tapCount = 0;
      return;
    }
    // Reset tap count if they stop tapping for 1.5 seconds
    this.tapTimer = setTimeout(() => { this.tapCount = 0; }, 1500);
  }

  dismissEasterEgg() {
    this.easterEggActive.set(false);
  }
}
