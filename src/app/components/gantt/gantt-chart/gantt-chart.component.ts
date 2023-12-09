import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttTask, VerticalMarker } from '../gantt-models';

@Component({
  selector: 'app-gantt-chart',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './gantt-chart.component.html',
  styleUrl: './gantt-chart.component.scss'
})
export class GanttChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() tasks: GanttTask[] = [];
  @Input() scale: number = 100
  @Input('task-height-px') taskHeightPx = 75
  @Input('task-label-width-px') taskLabelWidthPx = 250
  verticalMarkers?: VerticalMarker[] = []

  minStartTime!: number

  @ViewChild('taskRectanglesContainer', { read: ElementRef }) taskRectanglesContainer!: ElementRef
  @ViewChild('dateLabelsContainer', { read: ElementRef }) dateLabelsContainer!: ElementRef
  @ViewChild('ganttChart', { read: ElementRef }) ganttChart!: ElementRef

  constructor(private renderer: Renderer2) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scale'] && changes['scale'].currentValue != null) {
      this.setScrollablePercentWidths()
    }
  }

  ngOnInit(): void {

    this.minStartTime = this.tasks.length > 0 ? this.tasks[0].startDate.getTime() : 0;

    this.calculateVerticalMarkers()
  }

  ngAfterViewInit(): void {
    this.renderer.setStyle(this.ganttChart.nativeElement, 'grid-template-columns', `${this.taskLabelWidthPx}px 1fr`)
    this.renderer.setStyle(this.taskRectanglesContainer.nativeElement, 'height', `${this.taskHeightPx * this.tasks.length}px`)
    this.setScrollablePercentWidths()
  }

  setScrollablePercentWidths() {
    if (this.taskRectanglesContainer != null && this.dateLabelsContainer != null) {
      this.renderer.setStyle(this.taskRectanglesContainer.nativeElement, 'width', `${this.scale}%`)
      this.renderer.setStyle(this.dateLabelsContainer.nativeElement, 'width', `${this.scale}%`)

    }
  }

  calculateXPercent(task: GanttTask): number {
    const startTime = task.startDate.getTime();
    const relativeStartTime = startTime - this.minStartTime;
    return relativeStartTime / this.getTotalDurationMs() * 100
  }

  calculateYCoordinate(index: number): number {
    return index * this.taskHeightPx
  }

  calculateWidthPercent(task: GanttTask): number {
    return (task.endDate.getTime() - task.startDate.getTime()) / this.getTotalDurationMs() * 100
  }

  calculateVerticalMarkers(): void {
    const totalDurationDays = this.getTotalDurationDays();

    const minIntervalDays = 1;

    // Calculate the number of sub-intervals based on the total duration
    const numSubIntervals = Math.ceil(totalDurationDays / minIntervalDays);

    // Calculate the width of each sub-interval in pixels
    const subIntervalPercent = 1 / numSubIntervals * 100;

    // Calculate the position of each vertical markerhis.minStartTime))
    this.verticalMarkers = Array.from({ length: numSubIntervals }, (_, index) => { return { date: new Date(this.minStartTime + index * 86_400_000), percentLeft: index * subIntervalPercent }});
  }

  getTotalDurationMs(): number {
    const earliestStartTime = this.minStartTime;
    const latestEndTime = Math.max(...this.tasks.map(task => task.endDate.getTime()));
    return (latestEndTime - earliestStartTime)
  }

  getTotalDurationDays(): number {
    return this.getTotalDurationMs() / 86_400_000;
  }

}
