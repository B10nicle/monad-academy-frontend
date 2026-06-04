import { TaskDifficulty } from '../../shared/badges/difficulty-badge';
import { TaskTopic } from '../../shared/badges/topic-badge';

export interface PublicTaskSummary {
  id: number;
  title: string;
  slug: string;
  difficulty: TaskDifficulty;
  topic: TaskTopic;
}

export interface PublicTask {
  id: number;
  title: string;
  slug: string;
  description: string;
  methodName: string;
  methodReturnType: string;
  methodParameters: string;
  difficulty: TaskDifficulty;
  topic: TaskTopic;
  initialCode: string;
  createdAt: string;
  updatedAt: string;
  testCases: PublicTaskTestCase[];
}

export interface PublicTaskTestCase {
  id: number;
  input: string;
  expectedOutput: string;
  orderIndex: number;
}
