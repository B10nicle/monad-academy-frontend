import { Component, computed, input } from '@angular/core';

import { I18nPipe } from '../../core/i18n/i18n.pipe';

export type SubmissionStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'COMPILATION_ERROR'
  | 'RUNTIME_ERROR'
  | 'TIME_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR';

@Component({
  selector: 'app-submission-status-badge',
  imports: [I18nPipe],
  template: `
    <span
      class="badge"
      [class.accepted]="statusClass() === 'accepted'"
      [class.pending]="statusClass() === 'pending'"
      [class.running]="statusClass() === 'running'"
      [class.failed]="statusClass() === 'failed'"
    >
      {{ 'enum.submissionStatus.' + status() | t }}
    </span>
  `,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 700;
      line-height: 1;
    }

    .accepted {
      background: #dff7e7;
      color: #116631;
    }

    .pending,
    .running {
      background: #e6eef8;
      color: #244a76;
    }

    .failed {
      background: #ffe1df;
      color: #9b1f16;
    }
  `,
})
export class SubmissionStatusBadge {
  readonly status = input.required<SubmissionStatus>();

  protected readonly statusClass = computed(() => {
    const status = this.status();

    if (status === 'ACCEPTED') {
      return 'accepted';
    }

    if (status === 'PENDING' || status === 'RUNNING') {
      return status.toLowerCase();
    }

    return 'failed';
  });
}
