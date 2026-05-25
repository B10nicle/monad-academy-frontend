import { Component } from '@angular/core';

import { SubmissionStatusBadge } from '../../shared/badges/submission-status-badge';
import { EmptyState } from '../../shared/state/empty-state';

@Component({
  selector: 'app-submissions-placeholder',
  imports: [EmptyState, SubmissionStatusBadge],
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">History</p>
        <h1>My submissions</h1>
      </div>
      <app-submission-status-badge status="ACCEPTED" />
    </section>

    <app-empty-state
      title="Submission history is ready for API integration"
      message="Authenticated submission history will be wired in feature/submission-history."
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
  `,
})
export class SubmissionsPlaceholder {}
