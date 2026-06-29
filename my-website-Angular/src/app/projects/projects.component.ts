import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

// TODO (easy): add a "not-started" status to Project['status'] for ideas that
// don't have work underway yet (e.g. the API Protocols Exploration card). Give
// its tag a distinct color in projects.component.scss (.status.not-started) —
// gray to stand out from the blue "wip" / green "complete" tags while still
// matching the theme.

// TODO (easy): add an "on-hold" status to Project['status'] for projects that
// were started but are paused. Give its tag a red color in
// projects.component.scss (.status.on-hold) — distinct from the blue "wip",
// green "complete", and gray "not-started" tags while still matching the theme.
interface Project {
  title: string;
  href: string;
  playHref?: string;
  status: 'wip' | 'complete';
  statusLabel: string;
  description: string;
  tags: string[];
}

const ORDER_STORAGE_KEY = 'projects-order';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  // TODO: replace href values with real GitHub repo URLs once created
  projects: Project[] = [
    {
      title: 'Chess Game + AI',
      href: 'https://github.com/khylecalimlim/Chess',
      playHref: 'https://khylecalimlim.github.io/Chess/',
      status: 'wip',
      statusLabel: 'In Progress',
      description: 'A fully playable chess engine with a custom-built AI opponent using minimax with alpha-beta pruning. Includes full rule implementation — castling, en passant, promotion, check/checkmate — with adjustable difficulty levels.',
      tags: ['TypeScript', 'React', 'Vite', 'AI / Minimax']
    },
    {
      title: 'ESPN Fantasy Football Drafter',
      href: 'https://github.com/khylecalimlim/ESPNFantasyPredictor',
      status: 'wip',
      statusLabel: 'In Progress',
      description: 'A draft assistant and player predictor for ESPN Fantasy Football leagues. Analyses historical performance, injury data, and matchup schedules to recommend optimal picks in real time during a draft, with season-long projections to guide roster decisions.',
      tags: ['Python', 'Jupyter', 'Machine Learning', 'Pandas', 'scikit-learn']
    },
    {
      title: 'URL Shortener + Uptime Monitor',
      href: '#',
      status: 'wip',
      statusLabel: 'In Progress',
      description: 'A self-hosted link shortener where every registered URL is also tracked for uptime — a worker pings each link on a schedule and records status/response time, while clicks and health checks both persist as real history in Postgres (Redis only caches the hot redirect lookup and latest status, never the source of truth). Full container lifecycle build: Dockerised services orchestrated with Compose, then migrated to Kubernetes manifests with Ingress and TLS. The goal is real infra knowledge, not just the app.',
      tags: ['Docker', 'Kubernetes', 'k3s', 'Helm', 'Redis', 'PostgreSQL', 'GitHub Actions']
    },
    {
      title: 'Music League Analytics',
      href: '#',
      status: 'wip',
      statusLabel: 'In Progress',
      description: 'Data pipeline and dashboard for analysing Music League rounds — tracking scoring trends, voter behaviour, taste clusters, and head-to-head records across players. Includes ML clustering of players by taste profile.',
      tags: ['Python', 'Pandas', 'Plotly Dash', 'PostgreSQL', 'scikit-learn']
    },
    {
      title: 'API Protocols Exploration',
      href: '#',
      status: 'wip',
      statusLabel: 'In Progress',
      description: 'Hands-on projects to learn API styles beyond REST — a GraphQL API aggregating a few data sources behind one schema, and a gRPC client/server CLI tool exploring streaming RPCs. The goal is real protocol knowledge, not just another CRUD app.',
      tags: ['GraphQL', 'gRPC']
    }
  ];

  ngOnInit(): void {
    const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!savedOrder) return;

    const titleOrder: string[] = JSON.parse(savedOrder);
    this.projects.sort((a, b) => titleOrder.indexOf(a.title) - titleOrder.indexOf(b.title));
  }

  drop(event: CdkDragDrop<Project[]>) {
    moveItemInArray(this.projects, event.previousIndex, event.currentIndex);
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(this.projects.map(p => p.title)));
  }
}
