import { Component } from '@angular/core';

interface DashboardLink {
  label: string;
  href: string;
}

interface DashboardSection {
  title: string;
  links: DashboardLink[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  sections: DashboardSection[] = [
    {
      title: 'Learning Progress',
      links: [
        { label: 'NeetCode', href: 'https://neetcode.io/' },
        { label: 'LeetCode', href: 'https://leetcode.com/' },
        { label: 'Claude Code 101', href: 'https://anthropic.skilljar.com/claude-code-101' },
        { label: 'Docker Training', href: 'https://www.docker.com/trainings/' }
      ]
    },
    {
      title: 'Job Applications',
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        { label: 'BuiltIn', href: 'https://builtin.com/' },
        { label: 'Indeed', href: 'https://www.indeed.com/' }
      ]
    }
  ];
}
