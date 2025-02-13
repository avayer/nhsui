export interface DashboardData {
    pcnScores: PcnScore[];
    practiceScores: PracticeScore[];

}

export interface PcnScore{
    pcnId: number;
    score: number;
    boroughId: number;
    indicator: string;
    max: number;
    min: number;
}


export interface PracticeScore{
    practiceName: string;
    score: number;

}

export interface ChartData {
    pcn: string;
    score: number;
    borough: string;
    min: number;
    max: number;
    indicator: string;
  }