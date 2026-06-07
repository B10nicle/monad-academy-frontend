import { Component, input, output } from '@angular/core';

import { I18nPipe } from '../../core/i18n/i18n.pipe';

@Component({
  selector: 'app-error-state',
  imports: [I18nPipe],
  template: `
    <div class="state" role="alert">
      <div>
        <h2>{{ title() | t }}</h2>
        <p>{{ message() | t }}</p>
      </div>
      <button type="button" (click)="retry.emit()">{{ 'shared.error.retry' | t }}</button>
    </div>
  `,
  styles: `
    .state {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 24px;
      border: 1px solid #f1c6c2;
      border-radius: 8px;
      background: #fff6f5;
    }

    h2 {
      margin: 0 0 8px;
      font-size: 1rem;
    }

    p {
      margin: 0;
      color: #6f342f;
    }

    button {
      min-height: 36px;
      padding: 8px 12px;
      border: 1px solid #9b1f16;
      border-radius: 6px;
      background: #ffffff;
      color: #9b1f16;
      font-weight: 700;
      cursor: pointer;
    }
  `,
})
export class ErrorState {
  readonly title = input('shared.error.title');
  readonly message = input('shared.error.message');
  readonly retry = output<void>();
}
