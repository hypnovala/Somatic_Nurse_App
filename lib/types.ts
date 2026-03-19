export type QuestionKey =
  | 'activation'
  | 'fatigue'
  | 'tension'
  | 'breathRestriction'
  | 'support';

export type CheckInValues = Record<QuestionKey, number>;

export interface CheckInSubmission {
  values: CheckInValues;
  notes: string;
}

export interface SomaticExercise {
  id: 'grounding' | 'sigh' | 'unwind';
  name: string;
  duration: string;
  why: string;
  steps: string[];
}

export interface SomaticResult {
  supportMessage: string;
  exercise: SomaticExercise;
  audioScript: string;
  whyThisHelps: string;
  noteSummary?: string;
  averageLoad: number;
}

export interface QuestionDefinition {
  key: QuestionKey;
  label: string;
  hint: string;
}
