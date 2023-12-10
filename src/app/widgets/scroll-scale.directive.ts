import { Directive, Input, ElementRef, Renderer2, OnChanges, SimpleChanges, OnInit, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appScrollScale]',
  standalone: true
})
export class ScrollScaleDirective implements AfterViewInit, OnChanges {
  @Input('scale-percent') scalePercent: number = 100;
  @Input('scroll-percent') scrollPercent: number = 0;

  private originalWidth!: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Store the original width when the directive initializes
    this.originalWidth = this.el.nativeElement.offsetWidth;
    console.log(`orig width: ${this.originalWidth}`)
    this.updateWidth(); // Initial update based on default values
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scalePercent'] || changes['scrollPercent']) {
      this.updateWidth();
    }
  }

  private updateWidth(): void {
    const leftPercent = 100 - this.scalePercent;
    const scrollOffset = (this.scrollPercent / 100) * leftPercent;

    if (this.scalePercent === 100) {
      // Reset to the original width when scalePercent is 100%
      this.renderer.setStyle(this.el.nativeElement, 'width', `${this.originalWidth}px`);
      this.renderer.setStyle(this.el.nativeElement, 'transform', `translateX(-${scrollOffset}%)`);
    } else {
      // Calculate the new width based on the scalePercent and apply scroll offset
      const newWidth = (this.scalePercent / 100) * this.originalWidth;
      this.renderer.setStyle(this.el.nativeElement, 'width', `${newWidth}px`);
      this.renderer.setStyle(this.el.nativeElement, 'transform', `translateX(-${scrollOffset}%)`);
    }
  }
}
