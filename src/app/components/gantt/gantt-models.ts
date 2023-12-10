export interface GanttSection<TGanttTask extends IGanttTask> {
  name: string,
  tasks: Array<TGanttTask>
}

export interface IGanttTask {
  name: string;
  startDate: Date;
  endDate: Date;
}


export interface VerticalMarker {
  date: Date
  percentLeft: number
}

