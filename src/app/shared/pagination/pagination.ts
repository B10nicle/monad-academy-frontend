import { Component, computed, input, output } from '@angular/core';

import { I18nPipe } from '../../core/i18n/i18n.pipe';

@Component({
  selector: 'app-pagination',
  imports: [I18nPipe],
  template: `
    <nav class="pagination" [attr.aria-label]="'shared.pagination.aria' | t">
      <button type="button" [disabled]="isFirstPage()" (click)="pageChange.emit(page() - 1)">
        {{ 'shared.pagination.previous' | t }}
      </button>
      <span>{{
        'shared.pagination.page' | t: { page: page() + 1, totalPages: totalPagesLabel() }
      }}</span>
      <button type="button" [disabled]="isLastPage()" (click)="pageChange.emit(page() + 1)">
        {{ 'shared.pagination.next' | t }}
      </button>
    </nav>
  `,
  styles: `
    .pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      min-height: 40px;
    }

    button {
      min-height: 36px;
      padding: 8px 12px;
      border: 1px solid #cfd6e1;
      border-radius: 6px;
      background: #ffffff;
      color: #2d3645;
      font-weight: 700;
      cursor: pointer;
    }

    button:disabled {
      color: #9aa3b2;
      cursor: not-allowed;
    }

    span {
      color: #5e6878;
      font-weight: 600;
    }
  `,
})
export class Pagination {
  readonly page = input(0);
  readonly totalPages = input(0);
  readonly pageChange = output<number>();

  protected readonly totalPagesLabel = computed(() => Math.max(this.totalPages(), 1));
  protected readonly isFirstPage = computed(() => this.page() <= 0);
  protected readonly isLastPage = computed(() => this.page() + 1 >= this.totalPagesLabel());
}
