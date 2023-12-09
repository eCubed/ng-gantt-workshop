import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GanttChartComponent } from '../../components/gantt-chart/gantt-chart.component';
import { Task } from '../../models/base-models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    GanttChartComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  tasks: Task[] = [
    { name: 'Task A', startDate: new Date('2023-01-01T08:00:00'), endDate: new Date('2023-01-02T10:00:00') },
    { name: 'Task B', startDate: new Date('2023-01-02T11:30:00'), endDate: new Date('2023-01-03T14:30:00') },
    { name: 'Task C', startDate: new Date('2023-01-03T15:00:00'), endDate: new Date('2023-01-04T16:00:00') },
    { name: 'Task D', startDate: new Date('2023-01-04T17:30:00'), endDate: new Date('2023-01-06T10:00:00') },
    { name: 'Task E', startDate: new Date('2023-01-06T11:30:00'), endDate: new Date('2023-01-07T13:30:00') },
    { name: 'Task F', startDate: new Date('2023-01-07T14:00:00'), endDate: new Date('2023-01-09T08:30:00') },
    { name: 'Task G', startDate: new Date('2023-01-09T09:00:00'), endDate: new Date('2023-01-10T11:00:00') },
    { name: 'Task H', startDate: new Date('2023-01-10T12:30:00'), endDate: new Date('2023-01-11T15:30:00') },
    { name: 'Task I', startDate: new Date('2023-01-11T16:00:00'), endDate: new Date('2023-01-12T18:00:00') },
    { name: 'Task J', startDate: new Date('2023-01-12T19:30:00'), endDate: new Date('2023-01-14T08:00:00') },
  ];

}