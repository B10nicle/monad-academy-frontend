import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { catchError, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';

import { ApiError } from '../../core/api/api-error';
import { PageResponse } from '../../core/api/page-response';
import {
  SubmissionStatus,
  SubmissionStatusBadge,
} from '../../shared/badges/submission-status-badge';
import { Pagination } from '../../shared/pagination/pagination';
import { EmptyState } from '../../shared/state/empty-state';
import { ErrorState } from '../../shared/state/error-state';
import { LoadingState } from '../../shared/state/loading-state';
import { Submission } from '../submissions/submission.models';
import { AdminSubmissionQuery, AdminSubmissionsApiService } from './admin-submissions-api.service';

interface AdminSubmissionPageQuery extends AdminSubmissionQuery {
  page: number;
  size: number;
}

const SUBMISSION_STATUSES: SubmissionStatus[] = [
  'PENDING',
  'RUNNING',
  'ACCEPTED',
  'WRONG_ANSWER',
  'COMPILATION_ERROR',
  'RUNTIME_ERROR',
  'TIME_LIMIT_EXCEEDED',
  'INTERNAL_ERROR',
];

@Component({
  selector: 'app-admin-submissions-page',
  imports: [
    EmptyState,
    ErrorState,
    LoadingState,
    Pagination,
    ReactiveFormsModule,
    RouterLink,
    SubmissionStatusBadge,
  ],
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">Admin submissions</p>
        <h1>Submission review</h1>
      </div>

      <a class="secondary-link" routerLink="/admin">Admin home</a>
    </section>

    <form class="filters" [formGroup]="filtersForm" (ngSubmit)="applyFilters()">
      <label>
        User id
        <input type="text" formControlName="userId" placeholder="User ID" />
      </label>
      <label>
        Task id
        <input type="text" formControlName="taskId" placeholder="Task ID" />
      </label>
      <label>
        Status
        <select formControlName="status">
          <option value="">All statuses</option>
          @for (status of statuses; track status) {
            <option [value]="status">{{ status }}</option>
          }
        </select>
      </label>
      <div class="filter-actions">
        <button type="submit">Apply</button>
        <button type="button" class="secondary-button" (click)="resetFilters()">Reset</button>
      </div>
    </form>

    @if (loading()) {
      <app-loading-state label="Loading submissions..." />
    } @else if (errorMessage()) {
      <app-error-state
        [message]="errorMessage() ?? 'Could not load submissions.'"
        (retry)="reload()"
      />
    } @else if (submissionsPage(); as page) {
      <section class="table-summary">
        <strong>{{ page.totalElements }}</strong>
        <span>submissions found</span>
      </section>

      @if (page.content.length === 0) {
        <app-empty-state
          title="No submissions found"
          message="Try adjusting user, task, or status filters."
        />
      } @else {
        <section class="submissions-table" aria-label="Admin submission review">
          <div class="submission-row submission-row-header">
            <span>Id</span>
            <span>User</span>
            <span>Task</span>
            <span>Status</span>
            <span>Duration</span>
            <span>Created</span>
            <span>Updated</span>
            <span>Actions</span>
          </div>

          @for (submission of page.content; track submission.id) {
            <div class="submission-row">
              <span class="mono">{{ submission.id }}</span>
              <span class="mono">{{ submission.userId }}</span>
              <span class="mono">{{ submission.taskId }}</span>
              <app-submission-status-badge [status]="submission.status" />
              <span>{{ submission.executionDurationMs }} ms</span>
              <span>{{ submission.createdAt }}</span>
              <span>{{ submission.updatedAt }}</span>
              <span class="actions">
                <button type="button" (click)="selectedSourceCode.set(submission.sourceCode)">
                  Source
                </button>
                <button type="button" (click)="selectedMetadata.set(submission.executionMetadata)">
                  Metadata
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
      <div class="preview-backdrop" role="dialog" aria-label="Submitted source code">
        <div class="preview-card">
          <div class="preview-heading">
            <h2>Submitted source</h2>
            <button type="button" (click)="selectedSourceCode.set(null)">Close</button>
          </div>
          <pre>{{ sourceCode }}</pre>
        </div>
      </div>
    }

    @if (selectedMetadata() !== null) {
      <div class="preview-backdrop" role="dialog" aria-label="Execution metadata">
        <div class="preview-card">
          <div class="preview-heading">
            <h2>Execution metadata</h2>
            <button type="button" (click)="selectedMetadata.set(null)">Close</button>
          </div>
          @if (formatMetadata(selectedMetadata()); as metadata) {
            <pre>{{ metadata }}</pre>
          } @else {
            <app-empty-state
              title="No execution metadata"
              message="This submission does not include execution metadata."
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

    .secondary-link {
      color: #244a76;
      font-weight: 800;
      text-decoration: none;
    }

    .filters {
      display: grid;
      grid-template-columns: repeat(3, minmax(180px, 1fr)) auto;
      gap: 12px;
      align-items: end;
      margin-bottom: 16px;
      padding: 16px;
      border: 1px solid #dde2ea;
      border-radius: 8px;
      background: #ffffff;
    }

    label {
      display: grid;
      gap: 6px;
      color: #465163;
      font-size: 0.83rem;
      font-weight: 800;
    }

    input,
    select {
      min-height: 40px;
      padding: 9px 10px;
      border: 1px solid #cfd6e1;
      border-radius: 6px;
      background: #ffffff;
      color: #151922;
      font: inherit;
    }

    .filter-actions,
    .actions {
      display: flex;
      gap: 8px;
    }

    button {
      min-height: 36px;
      padding: 8px 12px;
      border: 1px solid #151922;
      border-radius: 6px;
      background: #151922;
      color: #ffffff;
      font-weight: 800;
      cursor: pointer;
    }

    button:hover {
      background: #2d3645;
    }

    .secondary-button,
    .actions button,
    .preview-heading button {
      border-color: #cfd6e1;
      background: #ffffff;
      color: #2d3645;
    }

    .secondary-button:hover,
    .actions button:hover,
    .preview-heading button:hover {
      background: #edf1f5;
    }

    .table-summary {
      display: inline-flex;
      gap: 6px;
      align-items: center;
      min-height: 32px;
      margin-bottom: 12px;
      padding: 7px 10px;
      border: 1px solid #d6dce5;
      border-radius: 6px;
      color: #465163;
      font-weight: 700;
    }

    .submissions-table {
      overflow: hidden;
      margin-bottom: 16px;
      border: 1px solid #dde2ea;
      border-radius: 8px;
      background: #ffffff;
    }

    .submission-row {
      display: grid;
      grid-template-columns:
        minmax(150px, 1.1fr) minmax(150px, 1.1fr) minmax(150px, 1.1fr) 160px 100px
        minmax(170px, 1fr) minmax(170px, 1fr) 170px;
      gap: 12px;
      align-items: center;
      min-height: 58px;
      padding: 12px 16px;
      border-bottom: 1px solid #edf1f5;
    }

    .submission-row:last-child {
      border-bottom: 0;
    }

    .submission-row-header {
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

    @media (max-width: 1280px) {
      .submission-row {
        grid-template-columns: 1fr;
      }

      .submission-row-header {
        display: none;
      }

      .actions {
        flex-wrap: wrap;
      }
    }

    @media (max-width: 900px) {
      .filters {
        grid-template-columns: 1fr;
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
export class AdminSubmissionsPage {
  private readonly adminSubmissionsApi = inject(AdminSubmissionsApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly statuses = SUBMISSION_STATUSES;
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly submissionsPage = signal<PageResponse<Submission> | null>(null);
  protected readonly currentQuery = signal<AdminSubmissionPageQuery>({
    page: 0,
    size: 20,
    userId: undefined,
    taskId: undefined,
    status: undefined,
  });
  protected readonly selectedSourceCode = signal<string | null>(null);
  protected readonly selectedMetadata = signal<string | null>(null);
  protected readonly filtersForm = this.formBuilder.nonNullable.group({
    userId: [''],
    taskId: [''],
    status: [''],
  });

  constructor() {
    this.route.queryParamMap
      .pipe(
        map((params) => readAdminSubmissionQuery(params)),
        distinctUntilChanged(sameQuery),
        tap((query) => {
          this.currentQuery.set(query);
          this.filtersForm.setValue(
            {
              userId: query.userId ?? '',
              taskId: query.taskId ?? '',
              status: query.status ?? '',
            },
            { emitEvent: false },
          );
          this.loading.set(true);
          this.errorMessage.set(null);
        }),
        switchMap((query) =>
          this.adminSubmissionsApi.listSubmissions(query).pipe(
            catchError((error: ApiError) => {
              this.errorMessage.set(error.message);
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

  protected applyFilters(): void {
    const formValue = this.filtersForm.getRawValue();

    void this.router.navigate(['/admin/submissions'], {
      queryParams: cleanQueryParams({
        page: 0,
        size: this.currentQuery().size,
        userId: formValue.userId.trim(),
        taskId: formValue.taskId.trim(),
        status: formValue.status,
      }),
    });
  }

  protected resetFilters(): void {
    this.filtersForm.reset({
      userId: '',
      taskId: '',
      status: '',
    });

    void this.router.navigate(['/admin/submissions'], {
      queryParams: {
        page: 0,
        size: this.currentQuery().size,
      },
    });
  }

  protected setPage(page: number): void {
    if (page < 0) {
      return;
    }

    void this.router.navigate(['/admin/submissions'], {
      queryParams: cleanQueryParams({
        ...this.currentQuery(),
        page,
      }),
    });
  }

  protected reload(): void {
    const query = this.currentQuery();
    this.loading.set(true);
    this.errorMessage.set(null);

    this.adminSubmissionsApi.listSubmissions(query).subscribe({
      next: (page) => {
        this.submissionsPage.set(page);
        this.loading.set(false);
      },
      error: (error: ApiError) => {
        this.errorMessage.set(error.message);
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

function readAdminSubmissionQuery(params: ParamMap): AdminSubmissionPageQuery {
  return {
    page: readNonNegativeInteger(params.get('page'), 0),
    size: readPositiveInteger(params.get('size'), 20),
    userId: readOptionalParam(params.get('userId')),
    taskId: readOptionalParam(params.get('taskId')),
    status: readStatus(params.get('status')),
  };
}

function sameQuery(previous: AdminSubmissionPageQuery, current: AdminSubmissionPageQuery): boolean {
  return (
    previous.page === current.page &&
    previous.size === current.size &&
    previous.userId === current.userId &&
    previous.taskId === current.taskId &&
    previous.status === current.status
  );
}

function cleanQueryParams(query: AdminSubmissionQuery): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ''),
  ) as Record<string, string | number>;
}

function readOptionalParam(value: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function readStatus(value: string | null): SubmissionStatus | undefined {
  return SUBMISSION_STATUSES.includes(value as SubmissionStatus)
    ? (value as SubmissionStatus)
    : undefined;
}

function readNonNegativeInteger(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

function readPositiveInteger(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
