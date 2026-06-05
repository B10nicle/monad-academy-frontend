import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AdminTaskFormPage } from './admin-task-form-page';
import { AdminTasksApiService } from './admin-tasks-api.service';

describe('AdminTaskFormPage', () => {
  let fixture: ComponentFixture<AdminTaskFormPage>;
  let adminTasksApi: Pick<
    AdminTasksApiService,
    'createTask' | 'updateTask' | 'addTestCase' | 'publishTask' | 'archiveTask'
  >;

  beforeEach(async () => {
    adminTasksApi = {
      createTask: vi.fn().mockReturnValue(
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
          status: 'DRAFT',
          initialCode: 'class Solution { public String mapValues(String input) { return input; } }',
          solutionTemplate:
            'class Solution { public String mapValues(String input) { return input; } }',
          createdAt: '2026-05-25T00:00:00Z',
          updatedAt: '2026-05-25T00:00:00Z',
          testCases: [],
        }),
      ),
      updateTask: vi.fn(),
      addTestCase: vi.fn(),
      publishTask: vi.fn(),
      archiveTask: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AdminTaskFormPage],
      providers: [
        provideRouter([]),
        {
          provide: AdminTasksApiService,
          useValue: adminTasksApi,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTaskFormPage);
    fixture.detectChanges();
  });

  it('should render task authoring form', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Task authoring');
    expect(compiled.textContent).toContain('Create task');
    expect(compiled.textContent).toContain('Test cases');
  });

  it('should submit create task request', () => {
    const component = fixture.componentInstance;

    component['taskForm'].setValue({
      title: 'Stream filter',
      slug: 'stream-filter',
      description: 'Filter values',
      methodName: 'mapValues',
      methodReturnType: 'String',
      methodParameters: 'String input',
      difficulty: 'EASY',
      topic: 'STREAM_API',
      status: 'DRAFT',
      initialCode: 'class Solution { public String mapValues(String input) { return input; } }',
      solutionTemplate:
        'class Solution { public String mapValues(String input) { return input; } }',
    });

    component['saveTask']();

    expect(adminTasksApi.createTask).toHaveBeenCalledWith({
      title: 'Stream filter',
      slug: 'stream-filter',
      description: 'Filter values',
      methodName: 'mapValues',
      methodReturnType: 'String',
      methodParameters: 'String input',
      difficulty: 'EASY',
      topic: 'STREAM_API',
      status: 'DRAFT',
      initialCode: 'class Solution { public String mapValues(String input) { return input; } }',
      solutionTemplate:
        'class Solution { public String mapValues(String input) { return input; } }',
      testCases: [],
    });
  });
});
