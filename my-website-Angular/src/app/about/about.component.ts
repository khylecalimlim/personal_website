import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  current = signal(0);

  get prevIndex() {
    return (this.current() - 1 + this.images.length) % this.images.length;
  }

  get nextIndex() {
    return (this.current() + 1) % this.images.length;
  }

  prev() {
    this.current.update(i => (i - 1 + this.images.length) % this.images.length);
  }

  next() {
    this.current.update(i => (i + 1) % this.images.length);
  }

  goTo(index: number) {
    this.current.set(index);
  }
}
