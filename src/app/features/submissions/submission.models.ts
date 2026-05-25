import { SubmissionStatus } from '../../shared/badges/submission-status-badge';

export interface SubmissionRequest {
  taskId: string;
  sourceCode: string;
}

export interface Submission {
  id: string;
  userId: string;
  taskId: string;
  sourceCode: string;
  status: SubmissionStatus;
  executionMetadata: string;
  executionDurationMs: number;
  createdAt: string;
  updatedAt: string;
}
