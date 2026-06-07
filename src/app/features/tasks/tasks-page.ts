import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';

import { ApiError } from '../../core/api/api-error';
import { PageResponse } from '../../core/api/page-response';
import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { I18nService } from '../../core/i18n/i18n.service';
import { DifficultyBadge } from '../../shared/badges/difficulty-badge';
import { TopicBadge } from '../../shared/badges/topic-badge';
import { Pagination } from '../../shared/pagination/pagination';
import { EmptyState } from '../../shared/state/empty-state';
import { ErrorState } from '../../shared/state/error-state';
import { LoadingState } from '../../shared/state/loading-state';
import { PublicTaskSummary } from './task.models';
import { TasksApiService } from './tasks-api.service';

interface CatalogQuery {
  page: number;
  size: number;
}

@Component({
  selector: 'app-tasks-page',
  imports: [
    DifficultyBadge,
    EmptyState,
    ErrorState,
    I18nPipe,
    LoadingState,
    Pagination,
    RouterLink,
    TopicBadge,
  ],
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">{{ 'tasks.catalog.eyebrow' | t }}</p>
        <h1>{{ 'tasks.catalog.title' | t }}</h1>
      </div>

      @if (tasksPage(); as page) {
        <div class="catalog-count">
          {{ 'tasks.catalog.count' | t: { count: page.totalElements } }}
        </div>
      }
    </section>

    @if (loading()) {
      <app-loading-state label="tasks.catalog.loading" />
    } @else if (errorMessage()) {
      <app-error-state
        [message]="errorMessage() ?? ('tasks.catalog.loadError' | t)"
        (retry)="reload()"
      />
    } @else if (tasksPage(); as page) {
      @if (page.content.length === 0) {
        <app-empty-state title="tasks.catalog.emptyTitle" message="tasks.catalog.emptyMessage" />
      } @else {
        <section class="catalog-table" [attr.aria-label]="'tasks.catalog.aria' | t">
          <div class="catalog-row catalog-row-header">
            <span>{{ 'tasks.catalog.column.task' | t }}</span>
            <span>{{ 'tasks.catalog.column.difficulty' | t }}</span>
            <span>{{ 'tasks.catalog.column.topic' | t }}</span>
          </div>

          @for (task of page.content; track task.id) {
            <a class="catalog-row task-row" [routerLink]="['/tasks', task.slug]">
              <span class="task-title">{{ task.title }}</span>
              <app-difficulty-badge [difficulty]="task.difficulty" />
              <app-topic-badge [topic]="task.topic" />
            </a>
          }
        </section>

        <app-pagination
          [page]="page.page"
          [totalPages]="page.totalPages"
          (pageChange)="setPage($event)"
        />
      }
    }
  `,
  styles: `
    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 20px;
    }

    .eyebrow {
      margin: 0 0 6px;
      color: #697386;
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.7rem, 3vw, 2.4rem);
      line-height: 1.1;
    }

    .catalog-count {
      min-height: 32px;
      padding: 7px 10px;
      border: 1px solid #d6dce5;
      border-radius: 6px;
      color: #465163;
      font-weight: 700;
      white-space: nowrap;
    }

    .catalog-table {
      overflow: hidden;
      margin-bottom: 16px;
      border: 1px solid #dde2ea;
      border-radius: 8px;
      background: #ffffff;
    }

    .catalog-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 130px 130px;
      gap: 16px;
      align-items: center;
      min-height: 56px;
      padding: 12px 16px;
      border-bottom: 1px solid #edf1f5;
    }

    .catalog-row:last-child {
      border-bottom: 0;
    }

    .catalog-row-header {
      min-height: 42px;
      background: #f8fafc;
      color: #697386;
      font-size: 0.78rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    .task-row {
      color: #151922;
      text-decoration: none;
    }

    .task-row:hover {
      background: #f8fafc;
    }

    .task-title {
      overflow: hidden;
      font-weight: 750;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (max-width: 680px) {
      .page-header {
        align-items: flex-start;
        flex-direction: column;
      }

      .catalog-row,
      .catalog-row-header {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .catalog-row-header {
        display: none;
      }

      .task-title {
        white-space: normal;
      }
    }
  `,
})
export class TasksPage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);
  private readonly tasksApi = inject(TasksApiService);

  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly tasksPage = signal<PageResponse<PublicTaskSummary> | null>(null);
  protected readonly currentQuery = signal<CatalogQuery>({ page: 0, size: 20 });

  constructor() {
    this.route.queryParamMap
      .pipe(
        map((params) => readCatalogQuery(params.get('page'), params.get('size'))),
        distinctUntilChanged((previous, current) => {
          return previous.page === current.page && previous.size === current.size;
        }),
        tap((query) => {
          this.currentQuery.set(query);
          this.loading.set(true);
          this.errorMessage.set(null);
        }),
        switchMap((query) => {
          return this.tasksApi.listTasks(query).pipe(
            catchError((error: ApiError) => {
              this.errorMessage.set(this.i18n.translateApiError(error, 'tasks.catalog.loadError'));
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((page) => {
        this.tasksPage.set(page);
        this.loading.set(false);
      });
  }

  protected setPage(page: number): void {
    if (page < 0) {
      return;
    }

    void this.router.navigate(['/tasks'], {
      queryParams: {
        page,
        size: this.currentQuery().size,
      },
    });
  }

  protected reload(): void {
    const query = this.currentQuery();
    this.loading.set(true);
    this.errorMessage.set(null);

    this.tasksApi.listTasks(query).subscribe({
      next: (page) => {
        this.tasksPage.set(page);
        this.loading.set(false);
      },
      error: (error: ApiError) => {
        this.errorMessage.set(this.i18n.translateApiError(error, 'tasks.catalog.loadError'));
        this.loading.set(false);
      },
    });
  }
}

function readCatalogQuery(page: string | null, size: string | null): CatalogQuery {
  return {
    page: readNonNegativeInteger(page, 0),
    size: readPositiveInteger(size, 20),
  };
}

function readNonNegativeInteger(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

function readPositiveInteger(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
