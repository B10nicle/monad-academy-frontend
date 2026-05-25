import { Component, input } from '@angular/core';

export type TaskDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

@Component({
  selector: 'app-difficulty-badge',
  template: `
    <span
      class="badge"
      [class.easy]="difficulty() === 'EASY'"
      [class.medium]="difficulty() === 'MEDIUM'"
      [class.hard]="difficulty() === 'HARD'"
    >
      {{ difficulty() }}
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

    .easy {
      background: #dff7e7;
      color: #116631;
    }

    .medium {
      background: #fff0c2;
      color: #755300;
    }

    .hard {
      background: #ffe1df;
      color: #9b1f16;
    }
  `,
})
export class DifficultyBadge {
  readonly difficulty = input.required<TaskDifficulty>();
}
