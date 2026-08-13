import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

const FUN_FACTS = [
  "this square doesn't exist, checked twice",
  'en passant: the only legal way to vanish a page',
  'not stalemate, just a broken link',
  'the pawn promoted to a 404',
  'castled straight out of the sitemap',
];

const FUN_FACT_INTERVAL      = 4000; // ms between facts
const FUN_FACT_FADE_DURATION = 300;  // ms — must match .fun-fact's CSS transition

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit, OnDestroy {
  funFact = signal(FUN_FACTS[0]);
  funFactFading = signal(false);
  private funFactInterval!: ReturnType<typeof setInterval>;

  ngOnInit() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let factIndex = 0;
    this.funFactInterval = setInterval(() => {
      this.funFactFading.set(true);
      setTimeout(() => {
        factIndex = (factIndex + 1) % FUN_FACTS.length;
        this.funFact.set(FUN_FACTS[factIndex]);
        this.funFactFading.set(false);
      }, FUN_FACT_FADE_DURATION);
    }, FUN_FACT_INTERVAL);
  }

  ngOnDestroy() {
    clearInterval(this.funFactInterval);
  }
}
