import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

interface CommandCenterLink {
  label: string;
  href: string;
  jiggling?: boolean;
  inverted?: boolean;
}

interface CommandCenterSection {
  title: string;
  links: CommandCenterLink[];
}

interface Certificate {
  title: string;
  pdfHref: string;
}

const ORDER_STORAGE_PREFIX = 'command-center-order-';

// TODO: add a "Resume ATS Grader" section/upload endpoint to Command Center.
// User uploads a resume (PDF/DOC/DOCX), it's sent to an open-source ATS-scoring
// engine, and the grading/feedback is displayed here.
//
// Searched (2026-06-25) for the "major company open-sourcing their ATS grader"
// the user recalled - found no such release from LinkedIn/Indeed/Workday/
// Greenhouse/etc. Still TBD; revisit if more detail surfaces (company name,
// rough date, where it was seen).
//
// Compared the two community candidates (2026-06-25, via GitHub API):
//   - srbhr/Resume-Matcher: 27.5k stars, Apache-2.0, pushed yesterday - by far
//     the most established/best-reviewed option. Supports a fully local LLM
//     via Ollama (resume data never leaves the machine if configured that
//     way), but is a real FastAPI + Next.js app meant to be self-hosted via
//     Docker - not a drop-in API. Stores parsed data in a local JSON file
//     (TinyDB) on disk.
//   - sunnypatell/ats-screener: only 70 stars, MIT, much smaller/newer
//     project - parses client-side in-browser, but sends extracted text to
//     an AI scoring call.
// Decision: Resume-Matcher is the better pick on legitimacy, but since this
// site deploys statically to GitHub Pages (no backend to reach), wiring it
// into the public Command Center needs a hosting decision first (run it
// locally for personal use only, vs. stand up a publicly-reachable backend).
// Paused for now - revisit hosting approach before implementing.
// Needs: a backend/serverless endpoint to receive the upload and call the
// grader (can't run resume-parsing/scoring client-side), plus a results view
// (score + feedback) in this component.
@Component({
  selector: 'app-command-center',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './command-center.component.html',
  styleUrl: './command-center.component.scss'
})
export class CommandCenterComponent implements OnInit {
  sections: CommandCenterSection[] = [
    {
      title: 'Learning Progress',
      links: [
        { label: 'NeetCode', href: 'https://neetcode.io/roadmap' },
        { label: 'LeetCode', href: 'https://leetcode.com/' },
        // TODO: replace this link/button with a different one once decided - the
        // course is finished, so this anthropic.skilljar.com link is no longer the
        // right target. What it should point to instead is TBD.
        { label: 'Claude Code 101', href: 'https://anthropic.skilljar.com/claude-code-101' },
        { label: 'Docker Training', href: 'https://www.docker.com/trainings/' }
      ]
    },
    {
      title: 'Completed',
      links: []
    },
    {
      // TODO (easy): add a Dice link to this section.
      // TODO (easy): rename this section title to "Job Boards".
      title: 'Job Applications',
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/khyle-calimlim-3b57b91b5/' },
        { label: 'BuiltIn', href: 'https://builtin.com/?application-tracker#application-tracker' },
        { label: 'Indeed', href: 'https://www.indeed.com/?from=gnav-viewjob' }
      ]
    }
  ];

  certificates: Certificate[] = [
    { title: 'Claude Code 101', pdfHref: '/command-center/certificates/ClaudeCode101-certificate.pdf' }
  ];

  ngOnInit(): void {
    for (const section of this.sections) {
      const savedOrder = localStorage.getItem(ORDER_STORAGE_PREFIX + section.title);
      if (!savedOrder) continue;

      const labelOrder: string[] = JSON.parse(savedOrder);
      section.links.sort((a, b) => labelOrder.indexOf(a.label) - labelOrder.indexOf(b.label));
    }
  }

  pop(link: CommandCenterLink): void {
    link.inverted = !link.inverted;
    link.jiggling = true;
  }

  drop(section: CommandCenterSection, event: CdkDragDrop<CommandCenterLink[]>): void {
    moveItemInArray(section.links, event.previousIndex, event.currentIndex);
    localStorage.setItem(
      ORDER_STORAGE_PREFIX + section.title,
      JSON.stringify(section.links.map(l => l.label))
    );
  }
}
