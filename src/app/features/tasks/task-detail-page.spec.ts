import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { SessionService } from '../../core/auth/session.service';
import { SubmissionsApiService } from '../submissions/submissions-api.service';
import { CodeEditor } from './code-editor';
import { TasksApiService } from './tasks-api.service';
import { TaskDetailPage } from './task-detail-page';

@Component({
  selector: 'app-code-editor',
  template: `<textarea></textarea>`,
})
class CodeEditorStub {
  readonly value = input('');
  readonly disabled = input(false);
  readonly solutionClassLabel = input('');
  readonly methodSignature = input('');
  readonly valueChange = output<string>();
}

describe('TaskDetailPage', () => {
  let fixture: ComponentFixture<TaskDetailPage>;
  let submissionsApi: Pick<
    SubmissionsApiService,
    'createSubmission' | 'listCurrentUserTaskSubmissions'
  >;
  let tasksApi: Pick<TasksApiService, 'getTask'>;

  beforeEach(async () => {
    tasksApi = {
      getTask: vi.fn().mockReturnValue(
        of({
          id: 1,
          title: 'Stream filter',
          slug: 'stream-filter',
          description: 'Filter values',
          methodName: 'mapValues',
          methodReturnType: 'String',
          methodParameters: 'String input',
          difficulty: 'EASY',
          topic: 'STREAM_API',
          initialCode: 'class Solution { public String mapValues(String input) { return input; } }',
          createdAt: '2026-05-25T00:00:00Z',
          updatedAt: '2026-05-25T00:00:00Z',
          testCases: [
            {
              id: 2,
              input: '1 2 3',
              expectedOutput: '2',
              orderIndex: 0,
            },
          ],
        }),
      ),
    };
    submissionsApi = {
      createSubmission: vi.fn(),
      listCurrentUserTaskSubmissions: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TaskDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ slug: 'stream-filter' })),
            snapshot: {
              paramMap: convertToParamMap({ slug: 'stream-filter' }),
            },
          },
        },
        {
          provide: SessionService,
          useValue: {
            isAuthenticated: () => false,
            isAdmin: () => false,
          },
        },
        {
          provide: SubmissionsApiService,
          useValue: submissionsApi,
        },
        {
          provide: TasksApiService,
          useValue: tasksApi,
        },
      ],
    })
      .overrideComponent(TaskDetailPage, {
        remove: {
          imports: [CodeEditor],
        },
        add: {
          imports: [CodeEditorStub],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TaskDetailPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render public task details', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(tasksApi.getTask).toHaveBeenCalledWith('stream-filter');
    expect(compiled.textContent).toContain('Stream filter');
    expect(compiled.textContent).toContain('Filter values');
    expect(compiled.textContent).toContain('Public tests');
  });
});
