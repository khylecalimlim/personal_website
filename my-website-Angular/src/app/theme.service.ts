import { Injectable, signal } from '@angular/core';

const DEFAULT_BG = '#1a1a1a';
const DEFAULT_TEXT = '#e0e0e0';
const DEFAULT_FONT = 'system-ui, -apple-system, sans-serif';

export interface FontOption {
  label: string;
  value: string;
}

export interface SparkPreset {
  label: string;
  glyphs: string[];
  colors: string[];
}

export const DEFAULT_SPARK_PRESET = 'stars';

export const SPARK_PRESETS: Record<string, SparkPreset> = {
  stars: {
    label: 'Stars',
    glyphs: ['✦', '✧', '★', '✷', '✺'],
    colors: ['#5b8dee', '#f5d76e', '#e8e8e8', '#9b8cf2'],
  },
  hearts: {
    label: 'Hearts',
    glyphs: ['♥', '❥', '💕', '💖', '💗'],
    colors: ['#ff6b9d', '#ff8fab', '#ffc2d1', '#e0529c'],
  },
  shapes: {
    label: 'Shapes',
    glyphs: ['●', '▲', '■', '◆', '✚'],
    colors: ['#5be05c', '#5b8dee', '#f5d76e', '#e8e8e8'],
  },
  fire: {
    label: 'Fire',
    glyphs: ['🔥', '✨', '💥', '⚡', '🌟'],
    colors: ['#ff7a3d', '#ff4d4d', '#ffce4d', '#ff9d4d'],
  },
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // TODO: textColor is only applied via inherited `color` on <main> (see
  // app.component.html), so any element with its own hardcoded color
  // (e.g. .subtitle, .description, muted/secondary text, links) doesn't
  // pick it up. The "Text Color" setting should apply to ALL text on the
  // site, not just elements that happen to inherit. Likely needs each
  // component's hardcoded text colors replaced with a var bound to
  // textColor (similar to the --header-text-color pattern used for
  // headings), or a broader CSS variable applied at a higher level.
  backgroundColor = signal(DEFAULT_BG);
  textColor = signal(DEFAULT_TEXT);
  fontFamily = signal(DEFAULT_FONT);
  applyFontToHeader = signal(false);
  applyTextColorToHeader = signal(false);
  clickSparksEnabled = signal(true);
  sparkPreset = signal(DEFAULT_SPARK_PRESET);

  readonly sparkPresetOptions = Object.entries(SPARK_PRESETS).map(([key, preset]) => ({
    key,
    label: preset.label,
  }));

  // Web fonts (Fira Code, Inter, Lato, Merriweather, Nunito, Oswald, Playfair
  // Display, Poppins, Raleway, Roboto, Space Mono, Ubuntu) are loaded via the
  // Google Fonts <link> in index.html, so they render identically everywhere.
  //
  // The remaining options are OS-installed system fonts (Comic Sans MS,
  // Garamond, Trebuchet MS, Wingdings) that simply aren't present on iOS/
  // Android — the browser silently falls back to a generic family there with
  // no error. Rather than hide them (they're genuinely available to desktop
  // visitors), they're labelled "(desktop)" so mobile users aren't left
  // wondering why picking "Wingdings" didn't turn the page into symbols.
  readonly fontOptions: FontOption[] = [
    { label: 'Comic Sans (desktop)', value: "'Comic Sans MS', 'Comic Sans', cursive" },
    { label: 'Fira Code',            value: "'Fira Code', monospace" },
    { label: 'Garamond (desktop)',   value: "Garamond, 'Times New Roman', serif" },
    { label: 'Inter',                value: "'Inter', sans-serif" },
    { label: 'Lato',                 value: "'Lato', sans-serif" },
    { label: 'Merriweather',         value: "'Merriweather', serif" },
    { label: 'Monospace',            value: "'Courier New', Courier, monospace" },
    { label: 'Nunito',               value: "'Nunito', sans-serif" },
    { label: 'Oswald',               value: "'Oswald', sans-serif" },
    { label: 'Playfair Display',     value: "'Playfair Display', serif" },
    { label: 'Poppins',              value: "'Poppins', sans-serif" },
    { label: 'Raleway',              value: "'Raleway', sans-serif" },
    { label: 'Roboto',               value: "'Roboto', sans-serif" },
    { label: 'Serif',                value: "Georgia, 'Times New Roman', serif" },
    { label: 'Space Mono',           value: "'Space Mono', monospace" },
    { label: 'System Default',       value: 'system-ui, -apple-system, sans-serif' },
    { label: 'Trebuchet (desktop)',  value: "'Trebuchet MS', Arial, sans-serif" },
    { label: 'Ubuntu',               value: "'Ubuntu', sans-serif" },
    { label: 'Wingdings (desktop)',  value: "'Wingdings', fantasy" },
  ];

  reset() {
    this.backgroundColor.set(DEFAULT_BG);
    this.textColor.set(DEFAULT_TEXT);
    this.fontFamily.set(DEFAULT_FONT);
    this.applyFontToHeader.set(false);
    this.applyTextColorToHeader.set(false);
    this.clickSparksEnabled.set(true);
    this.sparkPreset.set(DEFAULT_SPARK_PRESET);
  }
}
