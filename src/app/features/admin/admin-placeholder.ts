import { Component } from '@angular/core';

import { EmptyState } from '../../shared/state/empty-state';

@Component({
  selector: 'app-admin-placeholder',
  imports: [EmptyState],
  template: `
    <section class="page-header">
      <p class="eyebrow">Admin</p>
      <h1>Administration</h1>
    </section>

    <app-empty-state
      title="Admin workspace is ready"
      message="Task management and submission review will be wired in the admin feature specs."
    />
  `,
  styles: `
    .page-header {
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
export class AdminPlaceholder {}
