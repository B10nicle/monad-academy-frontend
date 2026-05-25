import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { EmptyState } from '../../shared/state/empty-state';

@Component({
  selector: 'app-admin-task-edit-limited-page',
  imports: [EmptyState, RouterLink],
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">Admin task</p>
        <h1>Edit task</h1>
      </div>
      <a routerLink="/admin/tasks/new">Create task</a>
    </section>

    <app-empty-state title="Direct task editing needs backend support" [message]="message" />
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

    a {
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
export class AdminTaskEditLimitedPage {
  private readonly route = inject(ActivatedRoute);
  protected readonly message = `Task ${this.route.snapshot.paramMap.get('id') ?? ''} cannot be loaded because the backend does not expose GET /api/admin/tasks/{id} yet.`;
}
