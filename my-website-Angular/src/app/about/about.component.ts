import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

const DRAG_THRESHOLD = 60; // px needed to commit to next/prev

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
export class AboutComponent {
  // TODO: replace placeholder URLs with real hobby photos
  images: CarouselImage[] = [
    { src: 'https://picsum.photos/seed/hobby1/800/500', alt: 'Hobby photo 1' },
    { src: 'https://picsum.photos/seed/hobby2/800/500', alt: 'Hobby photo 2' },
    { src: 'https://picsum.photos/seed/hobby3/800/500', alt: 'Hobby photo 3' },
    { src: 'https://picsum.photos/seed/hobby4/800/500', alt: 'Hobby photo 4' },
    { src: 'https://picsum.photos/seed/hobby5/800/500', alt: 'Hobby photo 5' },
  ];

  current   = signal(0);
  dragOffset = signal(0);
  isDragging = false;

  private dragStartX = 0;
  private hasDragged = false;

  get prevIndex() { return (this.current() - 1 + this.images.length) % this.images.length; }
  get nextIndex()  { return (this.current() + 1) % this.images.length; }

  prev() { this.current.update(i => (i - 1 + this.images.length) % this.images.length); }
  next() { this.current.update(i => (i + 1) % this.images.length); }
  goTo(index: number) { this.current.set(index); }

  onSideClick(direction: 'prev' | 'next') {
    if (this.hasDragged) return; // was a drag, not a tap
    direction === 'prev' ? this.prev() : this.next();
  }

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
    if (Math.abs(offset) > DRAG_THRESHOLD) {
      offset < 0 ? this.next() : this.prev();
    }
    this.dragOffset.set(0);
  }
}
