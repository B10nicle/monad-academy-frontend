import { TaskDifficulty } from '../../shared/badges/difficulty-badge';
import { TaskTopic } from '../../shared/badges/topic-badge';

export interface PublicTaskSummary {
  id: string;
  title: string;
  slug: string;
  difficulty: TaskDifficulty;
  topic: TaskTopic;
}
