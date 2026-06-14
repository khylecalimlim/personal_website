import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';
import { ResumeComponent } from './resume/resume.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { CommandCenterComponent } from './command-center/command-center.component';

// TODO: the "command-center" route/nav link below is currently public - make it
// hidden/inaccessible to anyone but me. Auth options to consider (cheapest first):
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
// becomes worth the migration. Once gated, also remove/hide the nav link in
// app.component.html and rename the route to an unlinked path.
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'resume', component: ResumeComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'command-center', component: CommandCenterComponent },
  { path: '**', redirectTo: '' }
];
