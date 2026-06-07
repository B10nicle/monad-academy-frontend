import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { ApiError } from '../../core/api/api-error';
import { PageResponse } from '../../core/api/page-response';
import { SessionService } from '../../core/auth/session.service';
import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { I18nService } from '../../core/i18n/i18n.service';
import { Submission, SubmissionRequest } from '../submissions/submission.models';
import { SubmissionsApiService } from '../submissions/submissions-api.service';
import { DifficultyBadge } from '../../shared/badges/difficulty-badge';
import { SubmissionStatusBadge } from '../../shared/badges/submission-status-badge';
import { TopicBadge } from '../../shared/badges/topic-badge';
import { EmptyState } from '../../shared/state/empty-state';
import { ErrorState } from '../../shared/state/error-state';
import { LoadingState } from '../../shared/state/loading-state';
import { CodeEditor } from './code-editor';
import { PublicTask } from './task.models';
import { TasksApiService } from './tasks-api.service';

@Component({
  selector: 'app-task-detail-page',
  imports: [
    CodeEditor,
    DifficultyBadge,
    EmptyState,
    ErrorState,
    I18nPipe,
    LoadingState,
    RouterLink,
    SubmissionStatusBadge,
    TopicBadge,
  ],
  template: `
    @if (loading()) {
      <app-loading-state label="tasks.detail.loading" />
    } @else if (errorMessage()) {
      <app-error-state
        [message]="errorMessage() ?? ('tasks.detail.loadError' | t)"
        (retry)="reloadTask()"
      />
    } @else if (task(); as currentTask) {
      <section class="workspace-header">
        <div>
          <a class="back-link" routerLink="/tasks">{{ 'tasks.detail.backToCatalog' | t }}</a>
          <h1>{{ currentTask.title }}</h1>
          <div class="badges">
            <app-difficulty-badge [difficulty]="currentTask.difficulty" />
            <app-topic-badge [topic]="currentTask.topic" />
          </div>
        </div>
      </section>

      <section class="workspace-grid">
        <article class="panel problem-panel">
          <h2>{{ 'tasks.detail.problem' | t }}</h2>
          <div class="problem-text">{{ currentTask.description }}</div>

          <h3>{{ 'tasks.detail.publicTests' | t }}</h3>
          @if (currentTask.testCases.length === 0) {
            <app-empty-state
              title="tasks.detail.noPublicTestsTitle"
              message="tasks.detail.noPublicTestsMessage"
            />
          } @else {
            <div class="test-list">
              @for (testCase of currentTask.testCases; track testCase.id) {
                <div class="test-case">
                  <div>
                    <span class="test-label">{{ 'tasks.detail.input' | t }}</span>
                    <pre>{{ testCase.input }}</pre>
                  </div>
                  <div>
                    <span class="test-label">{{ 'tasks.detail.expected' | t }}</span>
                    <pre>{{ testCase.expectedOutput }}</pre>
                  </div>
                </div>
              }
            </div>
          }
        </article>

        <div class="solution-stack">
          <section class="panel editor-panel">
            <div class="panel-heading">
              <h2>{{ 'tasks.detail.solution' | t }}</h2>
            </div>

            <app-code-editor
              [value]="sourceCode()"
              [disabled]="submitting()"
              (valueChange)="sourceCode.set($event)"
            />

            <div class="editor-actions">
              <button
                type="button"
                class="submit-button"
                [disabled]="submitting()"
                (click)="submit()"
              >
                {{ submitLabel() }}
              </button>
            </div>

            @if (submitError()) {
              <p class="api-error">{{ submitError() }}</p>
            }

            @if (latestSubmission(); as submission) {
              <div class="result-panel">
                <div class="result-heading">
                  <h3>{{ 'tasks.detail.latestResult' | t }}</h3>
                  <app-submission-status-badge [status]="submission.status" />
                </div>
                <dl>
                  <div>
                    <dt>{{ 'tasks.detail.duration' | t }}</dt>
                    <dd>{{ submission.executionDurationMs }} ms</dd>
                  </div>
                  <div>
                    <dt>{{ 'tasks.detail.submitted' | t }}</dt>
                    <dd>{{ submission.createdAt }}</dd>
                  </div>
                </dl>
                @if (formatMetadata(submission.executionMetadata); as metadata) {
                  <pre class="metadata">{{ metadata }}</pre>
                }
              </div>
            }
          </section>

          <section class="panel history-panel">
            <div class="panel-heading">
              <h2>{{ 'tasks.detail.mySubmissions' | t }}</h2>
              @if (!session.isAuthenticated()) {
                <a
                  class="login-link"
                  [routerLink]="['/login']"
                  [queryParams]="{ redirectTo: currentUrl() }"
                >
                  {{ 'tasks.detail.loginToSubmit' | t }}
                </a>
              }
            </div>

            @if (!session.isAuthenticated()) {
              <app-empty-state
                title="tasks.detail.historyPrivateTitle"
                message="tasks.detail.historyPrivateMessage"
              />
            } @else if (historyLoading()) {
              <app-loading-state label="tasks.detail.submissionsLoading" />
            } @else if (historyError()) {
              <app-error-state
                [message]="historyError() ?? ('tasks.detail.submissionsLoadError' | t)"
                (retry)="loadSubmissionHistory(currentTask.id)"
              />
            } @else if (submissionsPage(); as submissions) {
              @if (submissions.content.length === 0) {
                <app-empty-state
                  title="tasks.detail.noSubmissionsTitle"
                  message="tasks.detail.noSubmissionsMessage"
                />
              } @else {
                <div class="submission-list">
                  @for (submission of submissions.content; track submission.id) {
                    <button
                      type="button"
                      class="submission-row"
                      (click)="selectedSourceCode.set(submission.sourceCode)"
                    >
                      <app-submission-status-badge [status]="submission.status" />
                      <span>{{ submission.executionDurationMs }} ms</span>
                      <span>{{ submission.createdAt }}</span>
                      <span>{{ 'tasks.detail.viewSource' | t }}</span>
                    </button>
                  }
                </div>
              }
            }
          </section>
        </div>
      </section>

      @if (selectedSourceCode(); as source) {
        <div
          class="source-preview"
          role="dialog"
          [attr.aria-label]="'tasks.detail.sourceDialogAria' | t"
        >
          <div class="source-preview-card">
            <div class="panel-heading">
              <h2>{{ 'tasks.detail.submittedSource' | t }}</h2>
              <button type="button" class="secondary-button" (click)="selectedSourceCode.set(null)">
                {{ 'tasks.detail.close' | t }}
              </button>
            </div>
            <pre>{{ source }}</pre>
          </div>
        </div>
      }
    }
  `,
  styles: `
    .workspace-header {
      margin-bottom: 20px;
    }

    .back-link,
    .login-link {
      color: #244a76;
      font-weight: 700;
      text-decoration: none;
    }

    h1 {
      margin: 8px 0 12px;
      font-size: clamp(1.8rem, 3vw, 2.5rem);
      line-height: 1.1;
    }

    h2,
    h3 {
      margin: 0;
    }

    .badges,
    .panel-heading,
    .result-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .badges {
      justify-content: flex-start;
    }

    .workspace-grid {
      display: grid;
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
      gap: 20px;
      align-items: start;
      width: 100%;
    }

    .panel {
      min-width: 0;
      padding: 20px;
      border: 1px solid #dde2ea;
      border-radius: 8px;
      background: #ffffff;
    }

    .problem-text {
      margin: 16px 0 24px;
      color: #2d3645;
      line-height: 1.65;
      white-space: pre-wrap;
    }

    .test-list {
      display: grid;
      gap: 12px;
      margin-top: 12px;
    }

    .test-case {
      display: grid;
      gap: 10px;
      min-width: 0;
      overflow: hidden;
      padding: 12px;
      border: 1px solid #edf1f5;
      border-radius: 8px;
      background: #f8fafc;
    }

    .test-case > div {
      min-width: 0;
    }

    .test-label {
      display: inline-block;
      margin-bottom: 6px;
      color: #697386;
      font-size: 0.78rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    pre {
      overflow: auto;
      max-width: 100%;
      margin: 0;
      padding: 12px;
      border-radius: 6px;
      background: #151922;
      color: #f8fafc;
      font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .editor-panel {
      display: grid;
      gap: 16px;
    }

    .solution-stack {
      display: grid;
      gap: 20px;
      min-width: 0;
    }

    .editor-panel app-code-editor {
      display: block;
      min-height: 320px;
    }

    .editor-actions {
      display: flex;
      justify-content: flex-end;
    }

    .submit-button,
    .secondary-button {
      min-height: 38px;
      padding: 8px 12px;
      border: 0;
      border-radius: 6px;
      font-weight: 800;
      cursor: pointer;
    }

    .submit-button {
      background: #151922;
      color: #ffffff;
    }

    .submit-button:disabled {
      background: #a7afbc;
      cursor: not-allowed;
    }

    .secondary-button {
      background: #edf1f5;
      color: #2d3645;
    }

    .api-error {
      margin: 0;
      color: #9b1f16;
      font-weight: 700;
    }

    .result-panel {
      display: grid;
      gap: 12px;
      padding: 14px;
      border: 1px solid #d6dce5;
      border-radius: 8px;
      background: #f8fafc;
    }

    dl {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin: 0;
    }

    dt {
      color: #697386;
      font-size: 0.78rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    dd {
      margin: 4px 0 0;
      color: #2d3645;
      font-weight: 700;
    }

    .metadata {
      background: #ffffff;
      color: #151922;
    }

    .history-panel {
      min-width: 0;
    }

    .submission-list {
      display: grid;
      gap: 8px;
      margin-top: 14px;
    }

    .submission-row {
      display: grid;
      grid-template-columns: 180px 100px 1fr auto;
      gap: 12px;
      align-items: center;
      width: 100%;
      min-height: 48px;
      padding: 10px 12px;
      border: 1px solid #edf1f5;
      border-radius: 8px;
      background: #ffffff;
      color: #2d3645;
      cursor: pointer;
      text-align: left;
    }

    .submission-row:hover {
      background: #f8fafc;
    }

    .source-preview {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: grid;
      place-items: center;
      padding: 24px;
      background: rgba(21, 25, 34, 0.54);
    }

    .source-preview-card {
      width: min(860px, 100%);
      max-height: min(720px, calc(100vh - 48px));
      overflow: auto;
      padding: 20px;
      border-radius: 8px;
      background: #ffffff;
    }

    @media (max-width: 940px) {
      .workspace-grid {
        grid-template-columns: 1fr;
      }

      .submission-row {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class TaskDetailPage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);
  private readonly submissionsApi = inject(SubmissionsApiService);
  private readonly tasksApi = inject(TasksApiService);

  protected readonly session = inject(SessionService);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly task = signal<PublicTask | null>(null);
  protected readonly sourceCode = signal('');
  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly latestSubmission = signal<Submission | null>(null);
  protected readonly historyLoading = signal(false);
  protected readonly historyError = signal<string | null>(null);
  protected readonly submissionsPage = signal<PageResponse<Submission> | null>(null);
  protected readonly selectedSourceCode = signal<string | null>(null);

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('slug') ?? ''),
        tap(() => {
          this.loading.set(true);
          this.errorMessage.set(null);
          this.latestSubmission.set(null);
          this.submissionsPage.set(null);
        }),
        switchMap((slug) =>
          this.tasksApi.getTask(slug).pipe(
            catchError((error: ApiError) => {
              this.errorMessage.set(this.i18n.translateApiError(error, 'tasks.detail.loadError'));
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((task) => {
        this.task.set(task);
        this.loading.set(false);

        if (!task) {
          return;
        }

        this.sourceCode.set(task.initialCode);

        if (this.session.isAuthenticated()) {
          this.loadSubmissionHistory(task.id);
        }
      });
  }

  protected submit(): void {
    const task = this.task();

    if (!task) {
      return;
    }

    if (!this.session.isAuthenticated()) {
      void this.router.navigate(['/login'], {
        queryParams: {
          redirectTo: this.currentUrl(),
        },
      });
      return;
    }

    const request: SubmissionRequest = {
      taskId: task.id,
      sourceCode: this.sourceCode(),
    };

    this.submitting.set(true);
    this.submitError.set(null);

    this.submissionsApi.createSubmission(request).subscribe({
      next: (submission) => {
        this.latestSubmission.set(submission);
        this.submitting.set(false);
        this.loadSubmissionHistory(task.id);
      },
      error: (error: ApiError) => {
        this.submitError.set(this.i18n.translateApiError(error, 'api.error.generic'));
        this.submitting.set(false);
      },
    });
  }

  protected loadSubmissionHistory(taskId: number): void {
    this.historyLoading.set(true);
    this.historyError.set(null);

    this.submissionsApi.listCurrentUserTaskSubmissions(taskId, { page: 0, size: 10 }).subscribe({
      next: (page) => {
        this.submissionsPage.set(page);
        this.historyLoading.set(false);
      },
      error: (error: ApiError) => {
        this.historyError.set(
          this.i18n.translateApiError(error, 'tasks.detail.submissionsLoadError'),
        );
        this.historyLoading.set(false);
      },
    });
  }

  protected reloadTask(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      void this.router.navigate(['/tasks', slug]);
    }
  }

  protected currentUrl(): string {
    return this.router.url;
  }

  protected submitLabel(): string {
    if (this.submitting()) {
      return this.i18n.translate('tasks.detail.submitting');
    }

    return this.session.isAuthenticated()
      ? this.i18n.translate('tasks.detail.submit')
      : this.i18n.translate('tasks.detail.loginToSubmit');
  }

  protected formatMetadata(metadata: string | null | undefined): string | null {
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
