import { Component, input } from '@angular/core';

import { I18nPipe } from '../../core/i18n/i18n.pipe';

@Component({
  selector: 'app-empty-state',
  imports: [I18nPipe],
  template: `
    <div class="state">
      <h2>{{ title() | t }}</h2>
      <p>{{ message() | t }}</p>
    </div>
  `,
  styles: `
    .state {
      padding: 28px;
      border: 1px solid #dde2ea;
      border-radius: 8px;
      background: #ffffff;
    }

    h2 {
      margin: 0 0 8px;
      font-size: 1rem;
    }

    p {
      margin: 0;
      color: #5e6878;
    }
  `,
})
export class EmptyState {
  readonly title = input('shared.empty.title');
  readonly message = input('shared.empty.message');
}
