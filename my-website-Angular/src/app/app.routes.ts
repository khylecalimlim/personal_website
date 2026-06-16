import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';
import { ResumeComponent } from './resume/resume.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { CommandCenterComponent } from './command-center/command-center.component';

// TODO: add user sign-in with external auth + 2FA (practice exercise, no real user
// profiles needed). Suggested approach:
//   - Provider: Firebase Auth (free tier) — supports Google/GitHub OAuth + TOTP 2FA
//     out of the box, well-documented with Angular, and ties cleanly into the
//     command-center gating TODO below.
//   - Add a /login route (new LoginComponent) with an OAuth button and a 2FA prompt.
//   - Use an Angular route guard (CanActivate) to protect any routes that require auth.
//   - 2FA options: Firebase supports TOTP (authenticator app) and SMS MFA natively.
//     TOTP (e.g. Google Authenticator) is free; SMS costs per message.
//
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
