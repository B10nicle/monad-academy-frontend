import { TaskDifficulty } from '../../shared/badges/difficulty-badge';
import { TaskTopic } from '../../shared/badges/topic-badge';

export interface PublicTaskSummary {
  id: string;
  title: string;
  slug: string;
  difficulty: TaskDifficulty;
  topic: TaskTopic;
}

export interface PublicTask {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: TaskDifficulty;
  topic: TaskTopic;
  initialCode: string;
  createdAt: string;
  updatedAt: string;
  testCases: PublicTaskTestCase[];
}

export interface PublicTaskTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  orderIndex: number;
}
