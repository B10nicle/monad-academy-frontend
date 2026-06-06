import { Component, input } from '@angular/core';

import { I18nPipe } from '../../core/i18n/i18n.pipe';

@Component({
  selector: 'app-loading-state',
  imports: [I18nPipe],
  template: `<div class="state" role="status">{{ label() | t }}</div>`,
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
  readonly label = input('shared.loading');
}
