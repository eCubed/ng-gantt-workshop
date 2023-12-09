import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild, afterNextRender } from '@angular/core';
import { Task } from '../../models/base-models';
import { CommonModule } from '@angular/common';

interface VerticalMarker {
  date: Date
  percentLeft: number
}

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
  @Input() tasks: Task[] = [];
  @Input() scale: number = 100;
  verticalMarkers?: VerticalMarker[] = [];
  taskHeightPx = 75;
  taskLabelWidthPx = 200;

  minStartTime!: number

  @ViewChild('taskRectanglesContainer', { read: ElementRef }) taskRectanglesContainer!: ElementRef
  @ViewChild('dateLabelsContainer', { read: ElementRef }) dateLabelsContainer!: ElementRef

  constructor(private renderer: Renderer2) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scale'] && changes['scale'].currentValue != null) {
      console.log('scale changed...')
      this.setScrollablePercentWidths()
    }
  }

  ngOnInit(): void {

    // Find the minimum start time to use as a reference point for scaling
    this.minStartTime = this.tasks.length > 0 ? this.tasks[0].startDate.getTime() : 0;

    this.calculateVerticalMarkers()
  }

  ngAfterViewInit(): void {
     this.renderer.setStyle(this.taskRectanglesContainer.nativeElement, 'height', `${this.taskHeightPx * this.tasks.length}px`)
     this.setScrollablePercentWidths()
  }

  setScrollablePercentWidths() {
    if (this.taskRectanglesContainer != null && this.dateLabelsContainer != null) {
      this.renderer.setStyle(this.taskRectanglesContainer.nativeElement, 'width', `${this.scale}%`)
      this.renderer.setStyle(this.dateLabelsContainer.nativeElement, 'width', `${this.scale}%`)

    }
  }

  calculateXPercent(task: Task): number {
    const startTime = task.startDate.getTime();

    const relativeStartTime = startTime - this.minStartTime;

    // Ensure that .task-rectangle is positioned to the right of .task-name
    return relativeStartTime / this.getTotalDurationMs() * 100
  }

  calculateYCoordinate(index: number): number {
    return index * this.taskHeightPx
  }

  calculateWidthPercent(task: Task): number {
    //return this.scale * (task.endDate.getTime() - task.startDate.getTime());
    return (task.endDate.getTime() - task.startDate.getTime()) / this.getTotalDurationMs() * 100
  }

  calculateVerticalMarkers(): void {
    const totalDurationDays = this.getTotalDurationDays();

    const minIntervalDays = 1; // Set the minimum number of days per sub-interval

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
