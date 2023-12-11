import { GanttSection } from './../gantt-models';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
export class GanttChartComponent<TGanttTask extends IGanttTask> implements OnInit, OnChanges {
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
    console.log(`onChanges`);
    if (changes['sections'] != null && changes['sections'].currentValue != null) {
      this.minStartTime =  Math.min(...this.sections.flatMap(s => s.tasks).map(task => task.startDate.getTime()));
    }

    if (changes['scale'] != null && changes['scale'].currentValue != null) {
      this.calculateVerticalMarkers()
    }
  }

  ngOnInit(): void {
    /*
    console.log('onInit')
    this.minStartTime =  Math.min(...this.sections.flatMap(s => s.tasks).map(task => task.startDate.getTime()));
    this.calculateVerticalMarkers()
    */
  }

  calculateXPercent(task: IGanttTask): number {
    const startTime = task.startDate.getTime();
    const relativeStartTime = startTime - this.minStartTime;
    return relativeStartTime / this.getTotalDurationMs() * 100
  }

  calculateWidthPercent(task: IGanttTask): number {
    return (task.endDate.getTime() - task.startDate.getTime()) / this.getTotalDurationMs() * 100
  }

  calculateNumTicks(totalNumDays: number, maxNumTicksAt100Resolution: number, scale: number) {

    /* We will need to decide the number of ticks to render. If totalNumDays are too many, that would result in overcrowding. maxNumTicksAt100Resolution would be
      the largest number of ticks we would want to render at 100% resolution. If totalNumDays would exceed that, we'll need to start eliminating. That's where the
      coeefficients would come in.

      For now, let's say that there are 103 incoming totalNumDays, and we want to show only upto 20 tick marks at 100% scale. We know we'd need to reduce the
      number of ticks, and if we do that, each tick would be worth more days. So, we take floor(103/20). That's 5. We now find the first item in the coefficients array
      that is larger than 5. It's 7. So, now, we take floor(103/7). That 14. We will render 14 ticks, and each of those ticks will be worth 7 days. Those ticks will cover 98
      days. We wouldn't render the next tick, at 105, because that would be larger than 103, the totalNumDays.

      But there is yet another trick. What if the scale was 200? Now, we still have the same 14 ticks, but it seems like they are too far apart that we can probably squeeze
      in another tick between each one. So, now we need to take scale into consideration.
    */
    const coefficients = [2, 7, 28]

    if (totalNumDays <= maxNumTicksAt100Resolution) {
      return totalNumDays
    } else {
      const numDaysToConsiderWithScale = scale / 100 * totalNumDays
      console.log(`numDays with scale: ${numDaysToConsiderWithScale}`)

      const coefficientToCompare = Math.floor(numDaysToConsiderWithScale / maxNumTicksAt100Resolution)
      console.log(`coeff to compare: ${coefficientToCompare}`)
      const foundCoefficient = coefficients.find(c => c >= coefficientToCompare)
      console.log(`found coeff: ${foundCoefficient}`)

      if (foundCoefficient == undefined)
        return 0

      return Math.floor(numDaysToConsiderWithScale / foundCoefficient)
    }
  }

  calculateVerticalMarkers(): void {

    const totalDurationDays = this.getTotalDurationDays();
    console.log(`total duration days: ${totalDurationDays}`)
    // We will first assume that we will get one partition per day, but that might be too much.

    /* We introduce this scheme where we will first determine how many divisions there are if the zoom is 100% (the tightest).
    */
    const numSubIntervals = this.calculateNumTicks(totalDurationDays, 10, this.scale);
    console.log(`numSubintervals: ${numSubIntervals}`)
    const numDaysPerTick = Math.floor(totalDurationDays/numSubIntervals)
    console.log(`numDaysPerTick: ${numDaysPerTick}`)
    const subIntervalPercent = 100 / numSubIntervals

    // Calculate the position of each vertical markerhis.minStartTime))
    this.verticalMarkers = Array.from({ length: numSubIntervals }, (_, index) => { return { date: new Date(this.minStartTime + index * 86_400_000 * numDaysPerTick), percentLeft: index * subIntervalPercent }});
  }

  getTotalDurationMs(): number {
    const earliestStartTime = this.minStartTime;
    const latestEndTime = Math.max(...this.sections.flatMap(s => s.tasks).map(task => task.endDate.getTime()));
    return (latestEndTime - earliestStartTime) + 86_400_000
  }

  getTotalDurationDays(): number {
    return this.getTotalDurationMs() / 86_400_000;
  }

  onTaskRectangleClicked(task: TGanttTask) {
    this.taskSelected.emit(task)
  }

}
