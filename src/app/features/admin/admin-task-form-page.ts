import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiError } from '../../core/api/api-error';
import { DifficultyBadge } from '../../shared/badges/difficulty-badge';
import { TopicBadge } from '../../shared/badges/topic-badge';
import { EmptyState } from '../../shared/state/empty-state';
import {
  TaskRequest,
  TaskResponse,
  TaskTestCaseRequest,
  TaskTestCaseResponse,
} from './admin-task.models';
import { AdminTasksApiService } from './admin-tasks-api.service';

@Component({
  selector: 'app-admin-task-form-page',
  imports: [DifficultyBadge, EmptyState, ReactiveFormsModule, RouterLink, TopicBadge],
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">Admin task</p>
        <h1>Task authoring</h1>
      </div>
      <a class="secondary-link" routerLink="/admin">Admin home</a>
    </section>

    <section class="editor-grid">
      <form class="panel task-form" [formGroup]="taskForm" (ngSubmit)="saveTask()">
        <div class="panel-heading">
          <h2>{{ createdTask() ? 'Update task' : 'Create task' }}</h2>
          @if (createdTask(); as task) {
            <div class="badges">
              <app-difficulty-badge [difficulty]="task.difficulty" />
              <app-topic-badge [topic]="task.topic" />
              <span class="status-pill">{{ task.status }}</span>
            </div>
          }
        </div>

        <div class="field two-columns">
          <label>
            Title
            <input type="text" formControlName="title" />
          </label>
          <label>
            Slug
            <input type="text" formControlName="slug" />
          </label>
        </div>

        <div class="field three-columns">
          <label>
            Difficulty
            <select formControlName="difficulty">
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </label>
          <label>
            Topic
            <select formControlName="topic">
              <option value="STREAM_API">STREAM_API</option>
            </select>
          </label>
          <label>
            Status
            <select formControlName="status">
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </label>
        </div>

        <label class="field">
          Description
          <textarea rows="8" formControlName="description"></textarea>
        </label>

        <label class="field">
          Initial code
          <textarea rows="10" formControlName="initialCode"></textarea>
        </label>

        <label class="field">
          Solution template
          <textarea rows="10" formControlName="solutionTemplate"></textarea>
        </label>

        @if (taskError()) {
          <p class="api-error">{{ taskError() }}</p>
        }
        @if (taskMessage()) {
          <p class="api-success">{{ taskMessage() }}</p>
        }

        <div class="actions">
          <button type="submit" [disabled]="taskForm.invalid || taskSaving()">
            {{ taskSaving() ? 'Saving...' : createdTask() ? 'Update task' : 'Create task' }}
          </button>
          <button
            type="button"
            [disabled]="!createdTask() || lifecycleSaving()"
            (click)="publishTask()"
          >
            Publish
          </button>
          <button
            type="button"
            [disabled]="!createdTask() || lifecycleSaving()"
            (click)="archiveTask()"
          >
            Archive
          </button>
        </div>
      </form>

      <section class="panel test-panel">
        <div class="panel-heading">
          <h2>Test cases</h2>
          @if (createdTask(); as task) {
            <span class="status-pill"
              >{{ task.testCases.length + createdTestCases().length }} total</span
            >
          }
        </div>

        @if (!createdTask()) {
          <app-empty-state
            title="Create the task first"
            message="Test cases can be added after the backend returns a task id."
          />
        } @else {
          <form class="test-form" [formGroup]="testCaseForm" (ngSubmit)="addTestCase()">
            <label class="field">
              Input
              <textarea rows="5" formControlName="input"></textarea>
            </label>
            <label class="field">
              Expected output
              <textarea rows="5" formControlName="expectedOutput"></textarea>
            </label>
            <div class="field two-columns">
              <label>
                Order index
                <input type="number" formControlName="orderIndex" />
              </label>
              <label class="checkbox-label">
                <input type="checkbox" formControlName="hidden" />
                Hidden
              </label>
            </div>

            @if (testCaseError()) {
              <p class="api-error">{{ testCaseError() }}</p>
            }
            @if (testCaseMessage()) {
              <p class="api-success">{{ testCaseMessage() }}</p>
            }

            <button type="submit" [disabled]="testCaseForm.invalid || testCaseSaving()">
              {{ testCaseSaving() ? 'Adding...' : 'Add test case' }}
            </button>
          </form>

          @if (allTestCases().length === 0) {
            <app-empty-state
              title="No test cases yet"
              message="Added test cases will appear here."
            />
          } @else {
            <div class="test-list">
              @for (testCase of allTestCases(); track testCase.id) {
                <div class="test-case">
                  <span>#{{ testCase.orderIndex }}</span>
                  <span>{{ testCase.hidden ? 'hidden' : 'public' }}</span>
                  <pre>{{ testCase.input }}</pre>
                  <pre>{{ testCase.expectedOutput }}</pre>
                </div>
              }
            </div>
          }
        }
      </section>
    </section>
  `,
  styles: `
    .page-header,
    .panel-heading,
    .actions,
    .badges {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .page-header {
      align-items: flex-end;
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
      min-height: 36px;
      padding: 8px 12px;
      border-radius: 6px;
      background: #edf1f5;
      color: #2d3645;
      font-weight: 700;
      text-decoration: none;
    }

    .editor-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
      gap: 20px;
      align-items: start;
    }

    .panel {
      display: grid;
      gap: 18px;
      padding: 20px;
      border: 1px solid #dde2ea;
      border-radius: 8px;
      background: #ffffff;
    }

    form,
    .test-form {
      display: grid;
      gap: 16px;
    }

    .field {
      display: grid;
      gap: 7px;
    }

    .two-columns {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .three-columns {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    label {
      color: #2d3645;
      font-size: 0.9rem;
      font-weight: 700;
    }

    input,
    select,
    textarea {
      width: 100%;
      min-height: 40px;
      padding: 9px 11px;
      border: 1px solid #cfd6e1;
      border-radius: 6px;
      color: #151922;
    }

    textarea {
      resize: vertical;
    }

    .checkbox-label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .checkbox-label input {
      width: auto;
      min-height: auto;
    }

    button {
      min-height: 40px;
      padding: 8px 12px;
      border: 0;
      border-radius: 6px;
      background: #151922;
      color: #ffffff;
      font-weight: 800;
      cursor: pointer;
    }

    button:disabled {
      background: #a7afbc;
      cursor: not-allowed;
    }

    .status-pill {
      min-height: 24px;
      padding: 4px 8px;
      border-radius: 6px;
      background: #edf1f5;
      color: #465163;
      font-size: 0.78rem;
      font-weight: 800;
    }

    .api-error,
    .api-success {
      margin: 0;
      font-weight: 700;
    }

    .api-error {
      color: #9b1f16;
    }

    .api-success {
      color: #116631;
    }

    .test-list {
      display: grid;
      gap: 10px;
    }

    .test-case {
      display: grid;
      grid-template-columns: auto auto 1fr 1fr;
      gap: 10px;
      align-items: start;
      padding: 12px;
      border: 1px solid #edf1f5;
      border-radius: 8px;
      background: #f8fafc;
    }

    pre {
      overflow: auto;
      margin: 0;
      padding: 10px;
      border-radius: 6px;
      background: #151922;
      color: #f8fafc;
      font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
      font-size: 0.84rem;
    }

    @media (max-width: 980px) {
      .editor-grid,
      .two-columns,
      .three-columns {
        grid-template-columns: 1fr;
      }

      .test-case {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class AdminTaskFormPage {
  private readonly adminTasksApi = inject(AdminTasksApiService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly createdTask = signal<TaskResponse | null>(null);
  protected readonly createdTestCases = signal<TaskTestCaseResponse[]>([]);
  protected readonly taskSaving = signal(false);
  protected readonly lifecycleSaving = signal(false);
  protected readonly testCaseSaving = signal(false);
  protected readonly taskMessage = signal<string | null>(null);
  protected readonly taskError = signal<string | null>(null);
  protected readonly testCaseMessage = signal<string | null>(null);
  protected readonly testCaseError = signal<string | null>(null);

  protected readonly allTestCases = computed(() => [
    ...(this.createdTask()?.testCases ?? []),
    ...this.createdTestCases(),
  ]);

  protected readonly taskForm = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    description: ['', Validators.required],
    difficulty: ['EASY', Validators.required],
    topic: ['STREAM_API', Validators.required],
    status: ['DRAFT', Validators.required],
    initialCode: ['', Validators.required],
    solutionTemplate: ['', Validators.required],
  });

  protected readonly testCaseForm = this.formBuilder.nonNullable.group({
    input: ['', Validators.required],
    expectedOutput: ['', Validators.required],
    hidden: [false],
    orderIndex: [0, Validators.required],
  });

  protected saveTask(): void {
    this.taskForm.markAllAsTouched();

    if (this.taskForm.invalid || this.taskSaving()) {
      return;
    }

    const currentTask = this.createdTask();
    const request = this.taskRequest();
    this.taskSaving.set(true);
    this.taskMessage.set(null);
    this.taskError.set(null);

    const response = currentTask
      ? this.adminTasksApi.updateTask(currentTask.id, request)
      : this.adminTasksApi.createTask(request);

    response.subscribe({
      next: (task) => {
        this.createdTask.set(task);
        this.patchTaskForm(task);
        this.taskMessage.set(currentTask ? 'Task updated.' : 'Task created.');
        this.taskSaving.set(false);
      },
      error: (error: ApiError) => {
        this.taskError.set(error.message);
        this.taskSaving.set(false);
      },
    });
  }

  protected addTestCase(): void {
    const task = this.createdTask();
    this.testCaseForm.markAllAsTouched();

    if (!task || this.testCaseForm.invalid || this.testCaseSaving()) {
      return;
    }

    this.testCaseSaving.set(true);
    this.testCaseMessage.set(null);
    this.testCaseError.set(null);

    this.adminTasksApi.addTestCase(task.id, this.testCaseRequest()).subscribe({
      next: (testCase) => {
        this.createdTestCases.update((testCases) => [...testCases, testCase]);
        this.testCaseMessage.set('Test case added.');
        this.testCaseForm.reset({
          input: '',
          expectedOutput: '',
          hidden: false,
          orderIndex: this.allTestCases().length,
        });
        this.testCaseSaving.set(false);
      },
      error: (error: ApiError) => {
        this.testCaseError.set(error.message);
        this.testCaseSaving.set(false);
      },
    });
  }

  protected publishTask(): void {
    this.changeLifecycle('publish');
  }

  protected archiveTask(): void {
    this.changeLifecycle('archive');
  }

  private changeLifecycle(action: 'publish' | 'archive'): void {
    const task = this.createdTask();
    if (!task || this.lifecycleSaving()) {
      return;
    }

    this.lifecycleSaving.set(true);
    this.taskMessage.set(null);
    this.taskError.set(null);

    const response =
      action === 'publish'
        ? this.adminTasksApi.publishTask(task.id)
        : this.adminTasksApi.archiveTask(task.id);

    response.subscribe({
      next: (updatedTask) => {
        this.createdTask.set(updatedTask);
        this.patchTaskForm(updatedTask);
        this.taskMessage.set(action === 'publish' ? 'Task published.' : 'Task archived.');
        this.lifecycleSaving.set(false);
      },
      error: (error: ApiError) => {
        this.taskError.set(error.message);
        this.lifecycleSaving.set(false);
      },
    });
  }

  private taskRequest(): TaskRequest {
    const value = this.taskForm.getRawValue();
    return {
      ...value,
      difficulty: value.difficulty as TaskRequest['difficulty'],
      topic: value.topic as TaskRequest['topic'],
      status: value.status as TaskRequest['status'],
      testCases: [],
    };
  }

  private testCaseRequest(): TaskTestCaseRequest {
    return this.testCaseForm.getRawValue();
  }

  private patchTaskForm(task: TaskResponse): void {
    this.taskForm.patchValue({
      title: task.title,
      slug: task.slug,
      description: task.description,
      difficulty: task.difficulty,
      topic: task.topic,
      status: task.status,
      initialCode: task.initialCode,
      solutionTemplate: task.solutionTemplate,
    });
  }
}
