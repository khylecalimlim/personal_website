import { Injectable, signal } from '@angular/core';

const DEFAULT_BG = '#1a1a1a';
const DEFAULT_TEXT = '#e0e0e0';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  backgroundColor = signal(DEFAULT_BG);
  textColor = signal(DEFAULT_TEXT);

  reset() {
    this.backgroundColor.set(DEFAULT_BG);
    this.textColor.set(DEFAULT_TEXT);
  }
}
