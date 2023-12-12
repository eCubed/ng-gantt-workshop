import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GanttChartComponent } from '../../components/gantt/gantt-chart/gantt-chart.component';
import { FormsModule } from '@angular/forms';
import { GanttSection, IGanttTask } from '../../components/gantt/gantt-models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GanttChartComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  scaleFactors: number[] = [100, 110, 120, 130, 140, 150, 200, 250, 300]
  scaleFactor: number = 100


  sections: GanttSection<IGanttTask>[] = [
    {
      name: 'Group Alpha',
      tasks: [
        { name: 'Task A', startDate: new Date('2023-01-01T00:00:00'), endDate: new Date('2023-01-02T00:00:00') },
        { name: 'Task B', startDate: new Date('2023-01-02T00:00:00'), endDate: new Date('2023-01-03T00:00:00') },
        { name: 'Task C', startDate: new Date('2023-01-03T00:00:00'), endDate: new Date('2023-01-04T00:00:00') },
        { name: 'Task D', startDate: new Date('2023-01-04T00:00:00'), endDate: new Date('2023-01-06T00:00:00') },
        { name: 'Task E', startDate: new Date('2023-01-06T00:00:00'), endDate: new Date('2023-01-07T00:00:00') },
      ]
    },
    {
      name: 'Group Bravo',
      tasks: [
        { name: 'Task F', startDate: new Date('2023-01-07T00:00:00'), endDate: new Date('2023-01-09T00:00:00') },
        { name: 'Task G', startDate: new Date('2023-01-09T00:00:00'), endDate: new Date('2023-01-10T00:00:00') },
        { name: 'Task H', startDate: new Date('2023-01-10T00:00:00'), endDate: new Date('2023-01-11T00:00:00') },
        { name: 'Task I', startDate: new Date('2023-01-11T00:00:00'), endDate: new Date('2023-01-12T00:00:00') },
        { name: 'Task J', startDate: new Date('2023-01-12T00:00:00'), endDate: new Date('2023-01-14T00:00:00') },
      ]
    }
  ]
}
