import { GanttSection } from './../gantt-models';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges, ViewChild, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGanttTask, VerticalMarker } from '../gantt-models';
import { ScrollScaleDirective } from '../../../widgets/scroll-scale.directive';

@Component({
  selector: 'app-gantt-chart',
  standalone: true,
  imports: [
    CommonModule,
    ScrollScaleDirective
  ],
  templateUrl: './gantt-chart.component.html',
  styleUrl: './gantt-chart.component.scss'
})
export class GanttChartComponent<TGanttTask extends IGanttTask> implements OnInit, AfterViewInit {
  //@Input() tasks: TGanttTask[] = [];
  @Input() sections: GanttSection<TGanttTask>[] = []
  @Input() scale: number = 100
  @Input('task-height-px') taskHeightPx = 75
  @Input('task-label-width-px') taskLabelWidthPx = 250
  @Output('task-selected') taskSelected: EventEmitter<TGanttTask> = new EventEmitter<TGanttTask>()

  isReadyToRenderBars = false


  verticalMarkers?: VerticalMarker[] = []

  minStartTime!: number

  //@ViewChild('taskRectanglesContainer', { read: ElementRef }) taskRectanglesContainer!: ElementRef
  @ViewChild('dateLabelsContainer', { read: ElementRef }) dateLabelsContainer!: ElementRef
  @ViewChild('ganttChart', { read: ElementRef }) ganttChart!: ElementRef

  constructor(private renderer: Renderer2) {

  }

  ngOnInit(): void {

    this.minStartTime =  Math.min(...this.sections.flatMap(s => s.tasks).map(task => task.startDate.getTime())); //this.tasks.length > 0 ? this.tasks[0].startDate.getTime() : 0;

    this.calculateVerticalMarkers()
  }

  ngAfterViewInit(): void {
    console.log('gantt after view init')
    this.renderer.setStyle(this.ganttChart.nativeElement, 'grid-template-columns', `${this.taskLabelWidthPx}px 1fr`)

    setTimeout(() => {
      this.isReadyToRenderBars = true
    }, 200)
    //this.renderer.setStyle(this.taskRectanglesContainer.nativeElement, 'height', `${this.taskHeightPx * this.tasks.length}px`)
    //this.setScrollablePercentWidths()
  }


  calculateXPercent(task: IGanttTask): number {
    const startTime = task.startDate.getTime();
    const relativeStartTime = startTime - this.minStartTime;
    return relativeStartTime / this.getTotalDurationMs() * 100
  }

  calculateWidthPercent(task: IGanttTask): number {
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
    const latestEndTime = Math.max(...this.sections.flatMap(s => s.tasks).map(task => task.endDate.getTime()));
    return (latestEndTime - earliestStartTime)
  }

  getTotalDurationDays(): number {
    return this.getTotalDurationMs() / 86_400_000;
  }

  onTaskRectangleClicked(task: TGanttTask) {
    this.taskSelected.emit(task)
  }

}
