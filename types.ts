
export enum SkinCategory {
  HEALTHY = 'Healthy',
  NORMAL = 'Normal',
  NEEDS_CARE = 'Needs Care',
  POOR = 'Poor'
}

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface AnalysisDetail {
  severity: Severity;
  details: string;
}

export interface SkinAnalysisReport {
  overall_score: number;
  skin_category: SkinCategory;
  analysis: {
    acne: AnalysisDetail;
    dark_spots: AnalysisDetail;
    dark_circles: AnalysisDetail;
    skin_tone: AnalysisDetail;
  };
  recommendations: string[];
  disclaimer: string;
  date?: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

export type Tab = 'home' | 'analyze' | 'chat';
