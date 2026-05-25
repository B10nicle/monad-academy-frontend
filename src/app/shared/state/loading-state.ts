import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  template: `<div class="state" role="status">{{ label() }}</div>`,
  styles: `
    .state {
      padding: 24px;
      border: 1px solid #dde2ea;
      border-radius: 8px;
      background: #ffffff;
      color: #465163;
      font-weight: 600;
    }
  `,
})
export class LoadingState {
  readonly label = input('Loading...');
}
