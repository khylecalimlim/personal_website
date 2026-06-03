import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FeedbackEntry {
  id: string;
  name: string;
  comment: string;
  createdAt: Date;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  name = signal('');
  comment = signal('');
  submitting = signal(false);
  submitted = signal(false);
  errorMessage = signal<string | null>(null);

  // TODO(supabase): replace with entries loaded from the `feedback` table on init
  // e.g. const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
  entries = signal<FeedbackEntry[]>([]);

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
      setTimeout(() => this.submitted.set(false), 4000);
    } catch {
      this.errorMessage.set('Something went wrong. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }
}
