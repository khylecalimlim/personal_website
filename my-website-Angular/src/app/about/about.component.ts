import { Component, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

const DRAG_THRESHOLD = 50;
const SLIDE_DURATION = 350; // ms — must match CSS transition

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

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  ngAfterViewInit() {
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

  // ── Track data ─────────────────────────────────────────────────────────────

  // Always render 5 images: [c-2, c-1, c, c+1, c+2]
  // The outer container clips to show only [c-1, c, c+1].
  // c-2 and c+2 are off-screen buffers so dragging never reveals empty space.
  get imageSequence(): CarouselImage[] {
    const len = this.images.length;
    const c   = this.current();
    return [-2, -1, 0, 1, 2].map(o => this.images[(c + o + len * 3) % len]);
  }

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
    this.isDragging = true;
    this.hasDragged = false;
    this.dragStartX = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  onPointerMove(e: PointerEvent) {
    if (!this.isDragging) return;
    const delta = e.clientX - this.dragStartX;
    if (Math.abs(delta) > 5) this.hasDragged = true;
    this.dragOffset.set(delta);
  }

  onPointerUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    const offset = this.dragOffset();

    if (offset < -DRAG_THRESHOLD)     { this.hasDragged = true; this.commitNext(); }
    else if (offset > DRAG_THRESHOLD) { this.hasDragged = true; this.commitPrev(); }
    else                              { this.dragOffset.set(0); }
  }

  // Clicking a non-centre slide navigates (only when it wasn't a drag)
  onSlideClick(slotIndex: number) {
    if (this.hasDragged) return;
    if (slotIndex < 2)  this.commitPrev();
    if (slotIndex > 2)  this.commitNext();
  }

  // ── Commit helpers ─────────────────────────────────────────────────────────

  private commitNext() {
    this.dragOffset.set(-(this.containerWidth / 3));          // animate one slot left
    setTimeout(() => this.snapTo(1), SLIDE_DURATION);
  }

  private commitPrev() {
    this.dragOffset.set(this.containerWidth / 3);             // animate one slot right
    setTimeout(() => this.snapTo(-1), SLIDE_DURATION);
  }

  private snapTo(direction: 1 | -1) {
    this.snapping = true;
    this.current.update(c => (c + direction + this.images.length) % this.images.length);
    this.dragOffset.set(0);                                   // instant reset, no transition
    requestAnimationFrame(() => requestAnimationFrame(() => { this.snapping = false; }));
  }
}
