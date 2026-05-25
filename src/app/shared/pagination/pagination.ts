import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <nav class="pagination" aria-label="Pagination">
      <button type="button" [disabled]="isFirstPage()" (click)="pageChange.emit(page() - 1)">
        Previous
      </button>
      <span>Page {{ page() + 1 }} of {{ totalPagesLabel() }}</span>
      <button type="button" [disabled]="isLastPage()" (click)="pageChange.emit(page() + 1)">
        Next
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
