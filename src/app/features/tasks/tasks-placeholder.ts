import { Component } from '@angular/core';

import { DifficultyBadge } from '../../shared/badges/difficulty-badge';
import { TopicBadge } from '../../shared/badges/topic-badge';
import { EmptyState } from '../../shared/state/empty-state';

@Component({
  selector: 'app-tasks-placeholder',
  imports: [DifficultyBadge, EmptyState, TopicBadge],
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">Task catalog</p>
        <h1>Practice Java tasks</h1>
      </div>
      <div class="badges">
        <app-difficulty-badge difficulty="EASY" />
        <app-topic-badge topic="STREAM_API" />
      </div>
    </section>

    <app-empty-state
      title="Task catalog is ready for API integration"
      message="The public catalog endpoint will be wired in feature/task-catalog."
    />
  `,
  styles: `
    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 20px;
    }

    .eyebrow {
      margin: 0 0 6px;
      color: #697386;
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.7rem, 3vw, 2.4rem);
      line-height: 1.1;
    }

    .badges {
      display: flex;
      gap: 8px;
    }

    @media (max-width: 640px) {
      .page-header {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `,
})
export class TasksPlaceholder {}
