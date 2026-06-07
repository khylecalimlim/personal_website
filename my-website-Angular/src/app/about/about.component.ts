import { Component, signal, computed, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

const DRAG_THRESHOLD = 50;   // px — minimum drag distance to count as a deliberate swipe
const SLIDE_DURATION = 350;  // ms — must match CSS transition
const SPIN_VELOCITY  = 0.55; // px/ms — flick speed beyond which extra spin steps get added

interface CarouselImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('carouselOuter') carouselOuter!: ElementRef<HTMLDivElement>;

  // TODO: replace placeholder URLs with real hobby photos
  images: CarouselImage[] = [
    { src: 'https://picsum.photos/seed/hobby1/800/500', alt: 'Hobby photo 1' },
    { src: 'https://picsum.photos/seed/hobby2/800/500', alt: 'Hobby photo 2' },
    { src: 'https://picsum.photos/seed/hobby3/800/500', alt: 'Hobby photo 3' },
    { src: 'https://picsum.photos/seed/hobby4/800/500', alt: 'Hobby photo 4' },
    { src: 'https://picsum.photos/seed/hobby5/800/500', alt: 'Hobby photo 5' },
  ];

  current    = signal(0);
  dragOffset = signal(0);

  private isDragging    = false;
  private hasDragged    = false;
  private snapping      = false;
  private dragStartX    = 0;
  private containerWidth = 0;
  private resizeObs!: ResizeObserver;

  // Velocity tracking (px/ms) for flick-to-spin detection
  private lastMoveTime = 0;
  private lastMoveX    = 0;
  private velocity     = 0;

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  ngAfterViewInit() {
    this.preloadImages();
    this.containerWidth = this.carouselOuter.nativeElement.offsetWidth;
    this.setSlotVar();
    this.resizeObs = new ResizeObserver(entries => {
      this.containerWidth = entries[0].contentRect.width;
      this.setSlotVar();
    });
    this.resizeObs.observe(this.carouselOuter.nativeElement);
  }

  ngOnDestroy() { this.resizeObs?.disconnect(); }

  private setSlotVar() {
    this.carouselOuter.nativeElement.style.setProperty(
      '--slot-w', `${this.containerWidth / 3}px`
    );
  }

  // There are only 5 images and all 5 are always present in `imageSequence`
  // (just reordered as the carousel turns), so the only real cost is the
  // first-ever fetch + decode of each. Warming the image cache and decode
  // pipeline up front means that cost is paid once on page load instead of
  // mid-spin, which is where the jank was showing up.
  private preloadImages() {
    for (const img of this.images) {
      const preload = new Image();
      preload.src = img.src;
      preload.decode?.().catch(() => {});
    }
  }

  // ── Track data ─────────────────────────────────────────────────────────────

  // Always render 5 images: [c-2, c-1, c, c+1, c+2]
  // The outer container clips to show only [c-1, c, c+1].
  // c-2 and c+2 are off-screen buffers so dragging never reveals empty space.
  //
  // computed() instead of a getter: a plain getter re-ran (and rebuilt this
  // 5-element array) on every change-detection pass, including every single
  // pointermove while dragging — that array churn was the source of the drag
  // lag. computed() memoizes on `current` so it only rebuilds on slide change.
  imageSequence = computed<CarouselImage[]>(() => {
    const len = this.images.length;
    const c   = this.current();
    return [-2, -1, 0, 1, 2].map(o => this.images[(c + o + len * 3) % len]);
  });

  // baseOffset = -slotWidth so that slot[2] (current) is centred in the container.
  get trackTransform(): string {
    const base = -(this.containerWidth / 3);
    return `translateX(${base + this.dragOffset()}px)`;
  }

  get trackTransition(): string {
    return (this.isDragging || this.snapping) ? 'none' : `transform ${SLIDE_DURATION}ms ease`;
  }

  goTo(index: number) { this.current.set(index); }

  // ── Pointer / drag handlers ────────────────────────────────────────────────

  onPointerDown(e: PointerEvent) {
    this.isDragging   = true;
    this.hasDragged   = false;
    this.dragStartX   = e.clientX;
    this.lastMoveTime = performance.now();
    this.lastMoveX    = e.clientX;
    this.velocity     = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  onPointerMove(e: PointerEvent) {
    if (!this.isDragging) return;

    const now = performance.now();
    const dt  = now - this.lastMoveTime;
    if (dt > 0) this.velocity = (e.clientX - this.lastMoveX) / dt; // px per ms, signed
    this.lastMoveTime = now;
    this.lastMoveX    = e.clientX;

    const delta = e.clientX - this.dragStartX;
    if (Math.abs(delta) > 5) this.hasDragged = true;
    this.dragOffset.set(delta);
  }

  onPointerUp() {
    if (!this.isDragging) return;
    this.isDragging = false;

    const offset   = this.dragOffset();
    const distance = Math.abs(offset);
    const speed    = Math.abs(this.velocity);
    const slotW    = this.containerWidth / 3;

    // Not a deliberate swipe — too short and too slow — snap back to centre.
    if (distance <= DRAG_THRESHOLD && speed <= SPIN_VELOCITY) {
      this.dragOffset.set(0);
      return;
    }
    this.hasDragged = true;

    // Prefer the drag's direction; fall back to the flick's velocity for
    // quick taps that release before the pointer travels meaningfully.
    const direction: 1 | -1 = (distance > 1 ? offset < 0 : this.velocity < 0) ? 1 : -1;

    // Distance is the floor: dragging across N picture-widths spins at
    // least N slides — e.g. a slow 2-picture drag rotates exactly 2.
    const distanceSteps = Math.max(1, Math.floor(distance / slotW));

    // Velocity adds extra slides on top, scaled by how far past the spin
    // threshold the flick was — e.g. a fast 2-picture drag rotates 2 plus
    // however many extra slides the speed earns.
    const velocityExtra = speed > SPIN_VELOCITY
      ? Math.floor((speed - SPIN_VELOCITY) / SPIN_VELOCITY)
      : 0;

    this.spin(direction, distanceSteps + velocityExtra);
  }

  // Click anywhere on the carousel — determine which slot was clicked by x position
  onCarouselClick(e: MouseEvent) {
    if (this.hasDragged) return;
    const rect = this.carouselOuter.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const slotW = this.containerWidth / 3;
    if (x < slotW)          this.spin(-1, 1);
    else if (x > slotW * 2) this.spin(1, 1);
  }

  // ── Spin / commit ──────────────────────────────────────────────────────────

  // Advances `steps` slides in `direction`, one at a time (uncapped — a hard
  // enough flick can spin through as many images as it earns). Each step
  // slides a single slot then snaps the track back instantly (same
  // commit→snap cycle as a normal swipe), and — because `current` is a
  // signal — `imageSequence` and the `is-center` binding recompute and stay
  // in sync at every step, so the focal highlight tracks the spin rather
  // than jumping straight to the final image.
  private spin(direction: 1 | -1, steps: number) {
    if (steps <= 0) return;

    this.dragOffset.set(direction === 1 ? -(this.containerWidth / 3) : (this.containerWidth / 3));
    setTimeout(() => {
      this.snapping = true;
      this.current.update(c => (c + direction + this.images.length) % this.images.length);
      this.dragOffset.set(0); // instant reset, no transition
      requestAnimationFrame(() => requestAnimationFrame(() => {
        this.snapping = false;
        this.spin(direction, steps - 1);
      }));
    }, SLIDE_DURATION);
  }
}
