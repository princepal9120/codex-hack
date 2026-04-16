export type TaskStatus = "queued" | "running" | "passed" | "failed" | "needs_review";
export type CheckStatus = "passed" | "failed" | "pending";

export interface SelectedFile {
  path: string;
  score: number;
  excerpt?: string;
  rationale?: string;
  matchedTerms?: string[];
}

export interface TaskRecord {
  id: string;
  title: string;
  prompt: string;
  status: TaskStatus;
  repoPath: string;
  createdAt: string;
  updatedAt: string;
  runStartedAt: string | null;
  runFinishedAt: string | null;
  score: number;
  selectedFiles: SelectedFile[];
  promptPreview: string;
  contextSummary: string;
  executionMode: string;
  codexOutput: string;
  diffOutput: string;
  patchSummary: string;
  lintStatus: CheckStatus;
  testStatus: CheckStatus;
  lintOutput: string;
  testOutput: string;
  verificationNotes: string;
  logs: string;
  errorMessage: string | null;
  lintCommand: string | null;
  testCommand: string | null;
}

export interface CreateTaskInput {
  title: string;
  prompt: string;
  repoPath?: string;
  lintCommand?: string;
  testCommand?: string;
}

export interface RunTaskResult {
  status: TaskStatus;
  score: number;
  selectedFiles: SelectedFile[];
  promptPreview: string;
  contextSummary: string;
  executionMode: string;
  codexOutput: string;
  diffOutput: string;
  patchSummary: string;
  lintStatus: CheckStatus;
  testStatus: CheckStatus;
  lintOutput: string;
  testOutput: string;
  verificationNotes: string;
  logs: string;
  errorMessage?: string | null;
}
