import { Component, computed, input } from '@angular/core';

export type TaskTopic = 'STREAM_API';

@Component({
  selector: 'app-topic-badge',
  template: `<span class="badge">{{ topicLabel() }}</span>`,
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

  protected readonly topicLabel = computed(() => {
    switch (this.topic()) {
      case 'STREAM_API':
        return 'STREAM API';
    }
  });
}
