import { Component, input } from '@angular/core';

import { I18nPipe } from '../../core/i18n/i18n.pipe';

export type TaskTopic = 'STREAM_API';

@Component({
  selector: 'app-topic-badge',
  imports: [I18nPipe],
  template: `<span class="badge">{{ 'enum.topic.' + topic() | t }}</span>`,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      padding: 3px 8px;
      border-radius: 6px;
      background: #e9e3ff;
      color: #49308f;
      font-size: 0.78rem;
      font-weight: 700;
      line-height: 1;
    }
  `,
})
export class TopicBadge {
  readonly topic = input.required<TaskTopic>();
}
