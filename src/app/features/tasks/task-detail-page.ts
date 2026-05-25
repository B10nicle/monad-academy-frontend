import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { ApiError } from '../../core/api/api-error';
import { PageResponse } from '../../core/api/page-response';
import { SessionService } from '../../core/auth/session.service';
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
    LoadingState,
    RouterLink,
    SubmissionStatusBadge,
    TopicBadge,
  ],
  template: `
    @if (loading()) {
      <app-loading-state label="Loading task..." />
    } @else if (errorMessage()) {
      <app-error-state
        [message]="errorMessage() ?? 'Could not load task.'"
        (retry)="reloadTask()"
      />
    } @else if (task(); as currentTask) {
      <section class="workspace-header">
        <div>
          <a class="back-link" routerLink="/tasks">Back to catalog</a>
          <h1>{{ currentTask.title }}</h1>
          <div class="badges">
            <app-difficulty-badge [difficulty]="currentTask.difficulty" />
            <app-topic-badge [topic]="currentTask.topic" />
          </div>
        </div>
      </section>

      <section class="workspace-grid">
        <article class="panel problem-panel">
          <h2>Problem</h2>
          <div class="problem-text">{{ currentTask.description }}</div>

          <h3>Public tests</h3>
          @if (currentTask.testCases.length === 0) {
            <app-empty-state
              title="No public test cases"
              message="This task does not expose sample tests yet."
            />
          } @else {
            <div class="test-list">
              @for (testCase of currentTask.testCases; track testCase.id) {
                <div class="test-case">
                  <div>
                    <span class="test-label">Input</span>
                    <pre>{{ testCase.input }}</pre>
                  </div>
                  <div>
                    <span class="test-label">Expected</span>
                    <pre>{{ testCase.expectedOutput }}</pre>
                  </div>
                </div>
              }
            </div>
          }
        </article>

        <section class="panel editor-panel">
          <div class="panel-heading">
            <h2>Solution</h2>
            <button
              type="button"
              class="submit-button"
              [disabled]="submitting()"
              (click)="submit()"
            >
              {{ submitLabel() }}
            </button>
          </div>

          <app-code-editor
            [value]="sourceCode()"
            [disabled]="submitting()"
            (valueChange)="sourceCode.set($event)"
          />

          @if (submitError()) {
            <p class="api-error">{{ submitError() }}</p>
          }

          @if (latestSubmission(); as submission) {
            <div class="result-panel">
              <div class="result-heading">
                <h3>Latest result</h3>
                <app-submission-status-badge [status]="submission.status" />
              </div>
              <dl>
                <div>
                  <dt>Duration</dt>
                  <dd>{{ submission.executionDurationMs }} ms</dd>
                </div>
                <div>
                  <dt>Submitted</dt>
                  <dd>{{ submission.createdAt }}</dd>
                </div>
              </dl>
              @if (formatMetadata(submission.executionMetadata); as metadata) {
                <pre class="metadata">{{ metadata }}</pre>
              }
            </div>
          }
        </section>
      </section>

      <section class="panel history-panel">
        <div class="panel-heading">
          <h2>My submissions</h2>
          @if (!session.isAuthenticated()) {
            <a
              class="login-link"
              [routerLink]="['/login']"
              [queryParams]="{ redirectTo: currentUrl() }"
            >
              Log in to submit
            </a>
          }
        </div>

        @if (!session.isAuthenticated()) {
          <app-empty-state
            title="Submission history is private"
            message="Log in to submit solutions and review your attempts for this task."
          />
        } @else if (historyLoading()) {
          <app-loading-state label="Loading submissions..." />
        } @else if (historyError()) {
          <app-error-state
            [message]="historyError() ?? 'Could not load submissions.'"
            (retry)="loadSubmissionHistory(currentTask.id)"
          />
        } @else if (submissionsPage(); as submissions) {
          @if (submissions.content.length === 0) {
            <app-empty-state
              title="No submissions yet"
              message="Your attempts for this task will appear here."
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
                  <span>View source</span>
                </button>
              }
            </div>
          }
        }
      </section>

      @if (selectedSourceCode(); as source) {
        <div class="source-preview" role="dialog" aria-label="Submitted source code">
          <div class="source-preview-card">
            <div class="panel-heading">
              <h2>Submitted source</h2>
              <button type="button" class="secondary-button" (click)="selectedSourceCode.set(null)">
                Close
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
      grid-template-columns: minmax(280px, 0.9fr) minmax(420px, 1.1fr);
      gap: 20px;
      align-items: start;
    }

    .panel {
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
      padding: 12px;
      border: 1px solid #edf1f5;
      border-radius: 8px;
      background: #f8fafc;
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
      margin-top: 20px;
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
              this.errorMessage.set(error.message);
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
        this.submitError.set(error.message);
        this.submitting.set(false);
      },
    });
  }

  protected loadSubmissionHistory(taskId: string): void {
    this.historyLoading.set(true);
    this.historyError.set(null);

    this.submissionsApi.listCurrentUserTaskSubmissions(taskId, { page: 0, size: 10 }).subscribe({
      next: (page) => {
        this.submissionsPage.set(page);
        this.historyLoading.set(false);
      },
      error: (error: ApiError) => {
        this.historyError.set(error.message);
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
      return 'Submitting...';
    }

    return this.session.isAuthenticated() ? 'Submit solution' : 'Log in to submit';
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
