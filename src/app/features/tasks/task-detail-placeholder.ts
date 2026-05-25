import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { EmptyState } from '../../shared/state/empty-state';

@Component({
  selector: 'app-task-detail-placeholder',
  imports: [EmptyState, RouterLink],
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">Task</p>
        <h1>{{ slug }}</h1>
      </div>
      <a class="back-link" routerLink="/tasks">Back to catalog</a>
    </section>

    <app-empty-state
      title="Task workspace is next"
      message="Task details and code submission will be implemented in feature/task-workspace."
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

    .back-link {
      min-height: 36px;
      padding: 8px 12px;
      border-radius: 6px;
      background: #edf1f5;
      color: #2d3645;
      font-weight: 700;
      text-decoration: none;
    }
  `,
})
export class TaskDetailPlaceholder {
  private readonly route = inject(ActivatedRoute);

  protected readonly slug = this.route.snapshot.paramMap.get('slug') ?? 'Task';
}
