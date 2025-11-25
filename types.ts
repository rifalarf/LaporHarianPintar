export interface ReportData {
  activityExpanded: string;
  learningExpanded: string;
  obstacleExpanded: string;
}

export interface ReportInput {
  activity: string;
  learning: string;
  obstacle: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
