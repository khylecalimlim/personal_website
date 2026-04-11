import { Injectable, signal } from '@angular/core';

const DEFAULT_BG = '#1a1a1a';
const DEFAULT_TEXT = '#e0e0e0';
const DEFAULT_FONT = 'system-ui, -apple-system, sans-serif';

export interface FontOption {
  label: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  backgroundColor = signal(DEFAULT_BG);
  textColor = signal(DEFAULT_TEXT);
  fontFamily = signal(DEFAULT_FONT);
  applyFontToHeader = signal(false);
  applyTextColorToHeader = signal(false);

  readonly fontOptions: FontOption[] = [
    { label: 'Comic Sans',        value: "'Comic Sans MS', 'Comic Sans', cursive" },
    { label: 'Fira Code',         value: "'Fira Code', monospace" },
    { label: 'Garamond',          value: "Garamond, 'Times New Roman', serif" },
    { label: 'Inter',             value: "'Inter', sans-serif" },
    { label: 'Lato',              value: "'Lato', sans-serif" },
    { label: 'Merriweather',      value: "'Merriweather', serif" },
    { label: 'Monospace',         value: "'Courier New', Courier, monospace" },
    { label: 'Nunito',            value: "'Nunito', sans-serif" },
    { label: 'Oswald',            value: "'Oswald', sans-serif" },
    { label: 'Playfair Display',  value: "'Playfair Display', serif" },
    { label: 'Poppins',           value: "'Poppins', sans-serif" },
    { label: 'Raleway',           value: "'Raleway', sans-serif" },
    { label: 'Roboto',            value: "'Roboto', sans-serif" },
    { label: 'Serif',             value: "Georgia, 'Times New Roman', serif" },
    { label: 'Space Mono',        value: "'Space Mono', monospace" },
    { label: 'System Default',    value: 'system-ui, -apple-system, sans-serif' },
    { label: 'Trebuchet',         value: "'Trebuchet MS', Arial, sans-serif" },
    { label: 'Ubuntu',            value: "'Ubuntu', sans-serif" },
    { label: 'Wingdings',         value: "'Wingdings', fantasy" },
  ];

  reset() {
    this.backgroundColor.set(DEFAULT_BG);
    this.textColor.set(DEFAULT_TEXT);
    this.fontFamily.set(DEFAULT_FONT);
    this.applyFontToHeader.set(false);
    this.applyTextColorToHeader.set(false);
  }
}
