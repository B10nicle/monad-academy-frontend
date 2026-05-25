import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="state">
      <h2>{{ title() }}</h2>
      <p>{{ message() }}</p>
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
  readonly title = input('Nothing here yet');
  readonly message = input('There is no data to display.');
}
