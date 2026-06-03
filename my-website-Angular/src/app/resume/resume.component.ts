import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-resume',
  standalone: true,
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss'
})
export class ResumeComponent {
  private sanitizer = inject(DomSanitizer);
  readonly pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('resume.pdf');
  readonly pdfDownloadUrl = 'resume.pdf';
}
