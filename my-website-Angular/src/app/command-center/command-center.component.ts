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
        { label: 'Claude Code 101', href: 'https://anthropic.skilljar.com/claude-code-101' },
        { label: 'Docker Training', href: 'https://www.docker.com/trainings/' }
      ]
    },
    // TODO: add a certificate carousel to this section (similar pattern to the
    // image carousel in about.component.ts) showing earned certificates as
    // thumbnail/preview + title + link to the full PDF. First certificate ready to
    // add: "Claude Code 101" - PDF at
    // C:\Users\khyle\Desktop\Career, Application stuff\Certificates\ClaudeCode101-certificate.pdf
    // (accessible from WSL at /mnt/c/Users/khyle/Desktop/Career, Application stuff/
    // Certificates/ClaudeCode101-certificate.pdf). Plan: copy the PDF into
    // public/command-center/certificates/ (same pattern as public/resume.pdf) and
    // render it in the new carousel.
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

  pop(link: CommandCenterLink): void {
    link.inverted = !link.inverted;
    link.jiggling = true;
  }

  drop(section: CommandCenterSection, event: CdkDragDrop<CommandCenterLink[]>): void {
    moveItemInArray(section.links, event.previousIndex, event.currentIndex);
  }
}
