import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';

import { ApiError } from '../../core/api/api-error';
import { PageResponse } from '../../core/api/page-response';
import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { I18nService } from '../../core/i18n/i18n.service';
import { SubmissionStatusBadge } from '../../shared/badges/submission-status-badge';
import { Pagination } from '../../shared/pagination/pagination';
import { EmptyState } from '../../shared/state/empty-state';
import { ErrorState } from '../../shared/state/error-state';
import { LoadingState } from '../../shared/state/loading-state';
import { Submission } from './submission.models';
import { SubmissionsApiService } from './submissions-api.service';

interface HistoryQuery {
  page: number;
  size: number;
}

@Component({
  selector: 'app-submissions-page',
  imports: [EmptyState, ErrorState, I18nPipe, LoadingState, Pagination, SubmissionStatusBadge],
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">{{ 'submissions.eyebrow' | t }}</p>
        <h1>{{ 'submissions.title' | t }}</h1>
      </div>

      @if (submissionsPage(); as page) {
        <div class="history-count">
          {{ 'submissions.count' | t: { count: page.totalElements } }}
        </div>
      }
    </section>

    @if (loading()) {
      <app-loading-state label="submissions.loading" />
    } @else if (errorMessage()) {
      <app-error-state
        [message]="errorMessage() ?? ('submissions.loadError' | t)"
        (retry)="reload()"
      />
    } @else if (submissionsPage(); as page) {
      @if (page.content.length === 0) {
        <app-empty-state title="submissions.emptyTitle" message="submissions.emptyMessage" />
      } @else {
        <section class="history-table" [attr.aria-label]="'submissions.tableAria' | t">
          <div class="history-row history-row-header">
            <span>{{ 'submissions.column.status' | t }}</span>
            <span>{{ 'submissions.column.task' | t }}</span>
            <span>{{ 'submissions.column.duration' | t }}</span>
            <span>{{ 'submissions.column.created' | t }}</span>
            <span>{{ 'submissions.column.updated' | t }}</span>
            <span>{{ 'submissions.column.actions' | t }}</span>
          </div>

          @for (submission of page.content; track submission.id) {
            <div class="history-row">
              <app-submission-status-badge [status]="submission.status" />
              <span class="mono">{{ submission.taskId }}</span>
              <span>{{ submission.executionDurationMs }} ms</span>
              <span>{{ submission.createdAt }}</span>
              <span>{{ submission.updatedAt }}</span>
              <span class="actions">
                <button type="button" (click)="selectedSourceCode.set(submission.sourceCode)">
                  {{ 'submissions.action.source' | t }}
                </button>
                <button type="button" (click)="selectedMetadata.set(submission.executionMetadata)">
                  {{ 'submissions.action.metadata' | t }}
                </button>
              </span>
            </div>
          }
        </section>

        <app-pagination
          [page]="page.page"
          [totalPages]="page.totalPages"
          (pageChange)="setPage($event)"
        />
      }
    }

    @if (selectedSourceCode(); as sourceCode) {
      <div
        class="preview-backdrop"
        role="dialog"
        [attr.aria-label]="'submissions.sourceDialogAria' | t"
      >
        <div class="preview-card">
          <div class="preview-heading">
            <h2>{{ 'submissions.submittedSource' | t }}</h2>
            <button type="button" (click)="selectedSourceCode.set(null)">
              {{ 'tasks.detail.close' | t }}
            </button>
          </div>
          <pre>{{ sourceCode }}</pre>
        </div>
      </div>
    }

    @if (selectedMetadata() !== null) {
      <div
        class="preview-backdrop"
        role="dialog"
        [attr.aria-label]="'submissions.metadataDialogAria' | t"
      >
        <div class="preview-card">
          <div class="preview-heading">
            <h2>{{ 'submissions.executionMetadata' | t }}</h2>
            <button type="button" (click)="selectedMetadata.set(null)">
              {{ 'tasks.detail.close' | t }}
            </button>
          </div>
          @if (formatMetadata(selectedMetadata()); as metadata) {
            <pre>{{ metadata }}</pre>
          } @else {
            <app-empty-state
              title="submissions.noMetadataTitle"
              message="submissions.noMetadataMessage"
            />
          }
        </div>
      </div>
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

    h1,
    h2 {
      margin: 0;
    }

    h1 {
      font-size: clamp(1.7rem, 3vw, 2.4rem);
      line-height: 1.1;
    }

    .history-count {
      min-height: 32px;
      padding: 7px 10px;
      border: 1px solid #d6dce5;
      border-radius: 6px;
      color: #465163;
      font-weight: 700;
      white-space: nowrap;
    }

    .history-table {
      overflow: hidden;
      margin-bottom: 16px;
      border: 1px solid #dde2ea;
      border-radius: 8px;
      background: #ffffff;
    }

    .history-row {
      display: grid;
      grid-template-columns:
        160px minmax(180px, 1fr) 100px minmax(180px, 1fr) minmax(180px, 1fr)
        170px;
      gap: 12px;
      align-items: center;
      min-height: 58px;
      padding: 12px 16px;
      border-bottom: 1px solid #edf1f5;
    }

    .history-row:last-child {
      border-bottom: 0;
    }

    .history-row-header {
      min-height: 42px;
      background: #f8fafc;
      color: #697386;
      font-size: 0.78rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    .mono {
      overflow: hidden;
      font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
      font-size: 0.83rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    button {
      min-height: 34px;
      padding: 7px 10px;
      border: 1px solid #cfd6e1;
      border-radius: 6px;
      background: #ffffff;
      color: #2d3645;
      font-weight: 700;
      cursor: pointer;
    }

    button:hover {
      background: #edf1f5;
    }

    .preview-backdrop {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: grid;
      place-items: center;
      padding: 24px;
      background: rgba(21, 25, 34, 0.54);
    }

    .preview-card {
      width: min(900px, 100%);
      max-height: min(720px, calc(100vh - 48px));
      overflow: auto;
      padding: 20px;
      border-radius: 8px;
      background: #ffffff;
    }

    .preview-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }

    pre {
      overflow: auto;
      margin: 0;
      padding: 14px;
      border-radius: 6px;
      background: #151922;
      color: #f8fafc;
      font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
      font-size: 0.88rem;
      line-height: 1.5;
    }

    @media (max-width: 1040px) {
      .history-row {
        grid-template-columns: 1fr;
      }

      .history-row-header {
        display: none;
      }

      .actions {
        flex-wrap: wrap;
      }
    }

    @media (max-width: 640px) {
      .page-header {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `,
})
export class SubmissionsPage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly i18n = inject(I18nService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly submissionsApi = inject(SubmissionsApiService);

  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly submissionsPage = signal<PageResponse<Submission> | null>(null);
  protected readonly currentQuery = signal<HistoryQuery>({ page: 0, size: 20 });
  protected readonly selectedSourceCode = signal<string | null>(null);
  protected readonly selectedMetadata = signal<string | null>(null);

  constructor() {
    this.route.queryParamMap
      .pipe(
        map((params) => readHistoryQuery(params.get('page'), params.get('size'))),
        distinctUntilChanged((previous, current) => {
          return previous.page === current.page && previous.size === current.size;
        }),
        tap((query) => {
          this.currentQuery.set(query);
          this.loading.set(true);
          this.errorMessage.set(null);
        }),
        switchMap((query) =>
          this.submissionsApi.listCurrentUserSubmissions(query).pipe(
            catchError((error: ApiError) => {
              this.errorMessage.set(this.i18n.translateApiError(error, 'submissions.loadError'));
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((page) => {
        this.submissionsPage.set(page);
        this.loading.set(false);
      });
  }

  protected setPage(page: number): void {
    if (page < 0) {
      return;
    }

    void this.router.navigate(['/submissions'], {
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

    this.submissionsApi.listCurrentUserSubmissions(query).subscribe({
      next: (page) => {
        this.submissionsPage.set(page);
        this.loading.set(false);
      },
      error: (error: ApiError) => {
        this.errorMessage.set(this.i18n.translateApiError(error, 'submissions.loadError'));
        this.loading.set(false);
      },
    });
  }

  protected formatMetadata(metadata: string | null): string | null {
    if (!metadata) {
      return null;
    }

    try {
      return JSON.stringify(JSON.parse(metadata), null, 2);
    } catch {
      return metadata;
    }
  }
}

function readHistoryQuery(page: string | null, size: string | null): HistoryQuery {
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
