import { SubmissionStatus } from '../../shared/badges/submission-status-badge';

export interface SubmissionRequest {
  taskId: number;
  sourceCode: string;
}

export interface Submission {
  id: number;
  userId: number;
  taskId: number;
  sourceCode: string;
  status: SubmissionStatus;
  executionMetadata: string;
  executionDurationMs: number;
  createdAt: string;
  updatedAt: string;
}
