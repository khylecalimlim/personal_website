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
