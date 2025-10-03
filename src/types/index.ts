export type Studio = 'ES' | 'MS' | 'LP';
export type UserRole = 'Learner' | 'Guide';

export interface Example {
  text: string;
  criteriaCovered?: string[];
  criteriaMissing?: string[];
}

export interface Comparison {
  id: string;
  title: string;
  studio: Studio;
  promptText: string;
  worldClass: Example;
  notApproved: Example;
  createdAt: string;
  createdByRole: UserRole;
}

export interface GenerateExamplesRequest {
  promptText: string;
  studio: Studio;
}

export interface GenerateExamplesResponse {
  worldClass: Example;
  notApproved: Example;
  criteriaAll: string[];
}

export interface SaveComparisonRequest {
  title?: string;
  studio: Studio;
  promptText: string;
  worldClass: Example;
  notApproved: Example;
}

export interface SaveComparisonResponse {
  id: string;
}

export interface AppState {
  currentComparison: Comparison | null;
  savedComparisons: Comparison[];
  isLoading: boolean;
  error: string | null;
  activeStudio: Studio;
  currentPrompt: string;
}

