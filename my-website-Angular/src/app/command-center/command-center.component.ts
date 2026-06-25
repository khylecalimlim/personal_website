import { Component } from '@angular/core';
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

// TODO: add a "Resume ATS Grader" section/upload endpoint to Command Center.
// User uploads a resume (PDF/DOC/DOCX), it's sent to an open-source ATS-scoring
// engine, and the grading/feedback is displayed here.
//
// Searched (2026-06-25) for the "major company open-sourcing their ATS grader"
// the user recalled - found no such release from LinkedIn/Indeed/Workday/
// Greenhouse/etc. Still TBD; revisit if more detail surfaces (company name,
// rough date, where it was seen). Community options that do exist if no
// big-company release is found: srbhr/Resume-Matcher (github.com/srbhr/
// Resume-Matcher, actively maintained, Spacy/NLTK/vector-similarity scoring)
// and sunnypatell/ats-screener (simulates 6 real enterprise ATS platforms,
// client-side parsing) - not yet decided on either.
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
export class CommandCenterComponent {
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

  pop(link: CommandCenterLink): void {
    link.inverted = !link.inverted;
    link.jiggling = true;
  }

  drop(section: CommandCenterSection, event: CdkDragDrop<CommandCenterLink[]>): void {
    moveItemInArray(section.links, event.previousIndex, event.currentIndex);
  }
}
