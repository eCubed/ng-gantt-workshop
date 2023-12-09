export interface GanttSection {
  name: string,
  tasks: Array<GanttTask>
}

export interface GanttTask {
  name: string;
  startDate: Date;
  endDate: Date;
}


export interface VerticalMarker {
  date: Date
  percentLeft: number
}

