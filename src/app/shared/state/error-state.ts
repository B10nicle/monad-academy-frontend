import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  template: `
    <div class="state" role="alert">
      <div>
        <h2>{{ title() }}</h2>
        <p>{{ message() }}</p>
      </div>
      <button type="button" (click)="retry.emit()">Retry</button>
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
  readonly title = input('Something went wrong');
  readonly message = input('Please try again.');
  readonly retry = output<void>();
}
