import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FeedbackEntry {
  id: string;
  name: string;
  comment: string;
  createdAt: Date;
}

interface ConfettiPiece {
  id: number;
  left: number;   // vw, starting horizontal position
  dx: number;     // px, horizontal drift as it falls
  rotation: number;
  size: number;
  color: string;
  duration: number; // ms
  delay: number;    // ms
}

const CONFETTI_COUNT = 40;
const CONFETTI_COLORS = ['#5b8dee', '#f5d76e', '#ff6b9d', '#5be05c', '#9b8cf2', '#ff9d4d'];
const CONFETTI_LIFETIME = 2600; // ms — covers the longest duration + delay below

export const COMMENT_MAX_LENGTH = 1000;

function relativeTime(date: Date): string {
  const diffSec = Math.round((Date.now() - date.getTime()) / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffMonth / 12);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  if (diffMonth < 12) return `${diffMonth} month${diffMonth === 1 ? '' : 's'} ago`;
  return `${diffYear} year${diffYear === 1 ? '' : 's'} ago`;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  readonly commentMaxLength = COMMENT_MAX_LENGTH;

  name = signal('');
  comment = signal('');
  submitting = signal(false);
  submitted = signal(false);
  errorMessage = signal<string | null>(null);

  // TODO(supabase): replace with entries loaded from the `feedback` table on init
  // e.g. const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
  entries = signal<FeedbackEntry[]>([]);

  confetti = signal<ConfettiPiece[]>([]);
  private nextConfettiId = 0;

  relativeTime = relativeTime;

  private burstConfetti() {
    const burst: ConfettiPiece[] = Array.from({ length: CONFETTI_COUNT }, () => ({
      id: this.nextConfettiId++,
      left: Math.random() * 100,
      dx: (Math.random() - 0.5) * 120,
      rotation: Math.random() * 720 - 360,
      size: 6 + Math.random() * 8,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      duration: 1400 + Math.random() * 900,
      delay: Math.random() * 250,
    }));

    this.confetti.update(c => [...c, ...burst]);

    const ids = new Set(burst.map(p => p.id));
    setTimeout(() => {
      this.confetti.update(c => c.filter(p => !ids.has(p.id)));
    }, CONFETTI_LIFETIME);
  }

  async submit() {
    const name = this.name().trim();
    const comment = this.comment().trim();

    if (!name || !comment) {
      this.errorMessage.set('Please fill in both fields.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    try {
      // TODO(supabase): replace the block below with a real insert
      // const { error } = await supabase.from('feedback').insert({ name, comment });
      // if (error) throw error;

      // Temporary: add to local list so the UI feels functional
      const newEntry: FeedbackEntry = {
        id: crypto.randomUUID(),
        name,
        comment,
        createdAt: new Date()
      };
      this.entries.update(prev => [newEntry, ...prev]);

      this.name.set('');
      this.comment.set('');
      this.submitted.set(true);
      this.burstConfetti();
      setTimeout(() => this.submitted.set(false), 4000);
    } catch {
      this.errorMessage.set('Something went wrong. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }
}
