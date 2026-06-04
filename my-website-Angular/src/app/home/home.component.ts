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

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    this.keyBuffer.push(e.key);
    if (this.keyBuffer.length > KONAMI.length) this.keyBuffer.shift();
    if (this.keyBuffer.join() === KONAMI.join()) {
      this.easterEggActive.set(true);
      this.keyBuffer = [];
    }
  }

  dismissEasterEgg() {
    this.easterEggActive.set(false);
  }
}
