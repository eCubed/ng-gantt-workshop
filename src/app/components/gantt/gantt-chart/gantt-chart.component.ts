import { GanttSection } from './../gantt-models';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGanttTask, VerticalMarker } from '../gantt-models';
import { ScrollScaleDirective } from '../../../widgets/scroll-scale.directive';

interface TickMetrics {
  numTicks: number
  numDaysPerTick: number
}

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
export class GanttChartComponent<TGanttTask extends IGanttTask> implements OnChanges {
  @Input() sections: GanttSection<TGanttTask>[] = []
  @Input() scale: number = 100
  @Input('task-height-px') taskHeightPx = 75
  @Output('task-selected') taskSelected: EventEmitter<TGanttTask> = new EventEmitter<TGanttTask>()

  verticalMarkers?: VerticalMarker[] = []

  minStartTime!: number
  maxNumDivisions = 10

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sections'] != null && changes['sections'].currentValue != null) {
      this.minStartTime =  Math.min(...this.sections.flatMap(s => s.tasks).map(task => task.startDate.getTime()));
    }

    if (changes['scale'] != null && changes['scale'].currentValue != null) {
      this.calculateVerticalMarkers()
    }
  }

  calculateXPercent(task: IGanttTask): number {
    const relativeStartTime = task.startDate.getTime() - this.minStartTime;
    let effectiveTotalDurationMs = this.getTotalDurationMs()
    if (this.getTotalDurationDays() % 2 == 1)
      effectiveTotalDurationMs += 86_400_000
    return relativeStartTime / effectiveTotalDurationMs * 100
  }

  calculateWidthPercent(task: IGanttTask): number {
    let effectiveTotalDurationMs = this.getTotalDurationMs()
    if (this.getTotalDurationDays() % 2 == 1)
      effectiveTotalDurationMs += 86_400_000
    return (task.endDate.getTime() - task.startDate.getTime()) / effectiveTotalDurationMs * 100
  }

  calculateNumTickMetrics(totalNumDays: number, maxNumTicksAt100Resolution: number, scale: number): TickMetrics {

    /* We will need to decide the number of ticks to render. If totalNumDays are too many, that would result in overcrowding. maxNumTicksAt100Resolution would be
      the largest number of ticks we would want to render at 100% resolution. If totalNumDays would exceed that, we'll need to start eliminating. That's where the
      coeefficients would come in.
      */

    if (totalNumDays <= maxNumTicksAt100Resolution) {
      return {
        numTicks: totalNumDays,
        numDaysPerTick: 1
      }
    } else {
      const effectiveMaxNumTicks = scale / 100 * maxNumTicksAt100Resolution

      let numTicks = totalNumDays

      let iterationCount = 0
      while(numTicks > effectiveMaxNumTicks) {
        numTicks = Math.floor(totalNumDays / 2)
        iterationCount++
      }

      const numDaysPerTick = Math.pow(2, iterationCount)
      return { numTicks, numDaysPerTick }
    }
  }

  calculateVerticalMarkers(): void {

    let totalDurationDays = this.getTotalDurationDays()
    if (totalDurationDays % 2 == 1)
      totalDurationDays += 1

    const tickMetrics = this.calculateNumTickMetrics(totalDurationDays, 10, this.scale)

    const subIntervalPercent = 100 / tickMetrics.numTicks

    this.verticalMarkers = Array.from({ length: tickMetrics.numTicks }, (_, index) => { return { date: new Date(this.minStartTime + index * 86_400_000 * tickMetrics.numDaysPerTick), percentLeft: index * subIntervalPercent }});
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
