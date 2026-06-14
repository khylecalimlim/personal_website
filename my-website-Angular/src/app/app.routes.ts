import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';
import { ResumeComponent } from './resume/resume.component';
import { FeedbackComponent } from './feedback/feedback.component';

// TODO: add a private "dashboard" section, hidden/inaccessible to anyone but me, with:
//   - "Job Applications" sub-section: links to LinkedIn, BuiltIn, Indeed
//   - "Learning Progress" sub-section: links to NeetCode/LeetCode profile, and current
//     courses/certs (e.g. https://anthropic.skilljar.com/claude-code-101, future Azure certs,
//     https://www.docker.com/trainings/)
// Auth options to consider (cheapest first):
//   1. Client-side passphrase gate on a hidden, unlinked route (e.g. /dash-<random>):
//      compare a hashed passphrase, unlock stored in localStorage. Free, zero infra,
//      but it's obscurity not real security (source is public on a static site) - fine
//      since this section won't hold sensitive secrets, just personal links.
//   2. Cloudflare Pages + Cloudflare Access (free up to 50 users): real email-based
//      auth (OTP/login) gating the whole route at the edge before it's served. Requires
//      moving hosting from GitHub Pages to Cloudflare Pages, but free and low effort.
//   3. Firebase Hosting + Firebase Auth (Google sign-in restricted to my email): free
//      tier covers this easily, more setup than option 2.
// Recommendation: start with option 1 for a quick MVP, revisit option 2 if real auth
// becomes worth the migration.
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'resume', component: ResumeComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: '**', redirectTo: '' }
];
