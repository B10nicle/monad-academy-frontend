import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { I18nService } from '../../core/i18n/i18n.service';
import { EmptyState } from '../../shared/state/empty-state';

@Component({
  selector: 'app-admin-task-edit-limited-page',
  imports: [EmptyState, I18nPipe, RouterLink],
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">{{ 'admin.task.eyebrow' | t }}</p>
        <h1>{{ 'admin.edit.title' | t }}</h1>
      </div>
      <a routerLink="/admin/tasks/new">{{ 'admin.edit.createTask' | t }}</a>
    </section>

    <app-empty-state title="admin.edit.emptyTitle" [message]="message()" />
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
  private readonly i18n = inject(I18nService);

  protected readonly message = computed(() => {
    return this.i18n.translate('admin.edit.emptyMessage', {
      id: this.route.snapshot.paramMap.get('id') ?? '',
    });
  });
}
