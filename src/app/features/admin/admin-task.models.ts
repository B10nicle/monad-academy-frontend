import { TaskDifficulty } from '../../shared/badges/difficulty-badge';
import { TaskTopic } from '../../shared/badges/topic-badge';

export type TaskStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface TaskRequest {
  title: string;
  slug: string;
  description: string;
  methodName: string;
  methodReturnType: string;
  methodParameters: string;
  difficulty: TaskDifficulty;
  topic: TaskTopic;
  status: TaskStatus;
  initialCode: string;
  solutionTemplate: string;
  testCases: TaskTestCaseRequest[];
}

export interface TaskTestCaseRequest {
  input: string;
  expectedOutput: string;
  hidden: boolean;
  orderIndex: number;
}

export interface TaskResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
  methodName: string;
  methodReturnType: string;
  methodParameters: string;
  difficulty: TaskDifficulty;
  topic: TaskTopic;
  status: TaskStatus;
  initialCode: string;
  solutionTemplate: string;
  createdAt: string;
  updatedAt: string;
  testCases: TaskTestCaseResponse[];
}

export interface TaskTestCaseResponse {
  id: number;
  taskId: number;
  input: string;
  expectedOutput: string;
  hidden: boolean;
  orderIndex: number;
  createdAt: string;
}
