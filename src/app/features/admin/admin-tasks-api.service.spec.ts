import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../../core/api/api-config';
import { TaskRequest } from './admin-task.models';
import { AdminTasksApiService } from './admin-tasks-api.service';

describe('AdminTasksApiService', () => {
  const taskRequest: TaskRequest = {
    title: 'Stream filter',
    slug: 'stream-filter',
    description: 'Filter values',
    difficulty: 'EASY',
    topic: 'STREAM_API',
    status: 'DRAFT',
    initialCode: 'class Solution {}',
    solutionTemplate: 'class Solution {}',
    testCases: [],
  };

  let httpTesting: HttpTestingController;
  let service: AdminTasksApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: API_BASE_URL,
          useValue: 'http://localhost:8080',
        },
      ],
    });

    TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AdminTasksApiService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create an admin task', () => {
    service.createTask(taskRequest).subscribe();

    const request = httpTesting.expectOne('http://localhost:8080/api/admin/tasks');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(taskRequest);
    request.flush(responseBody());
  });

  it('should update an admin task', () => {
    service.updateTask('task-id', taskRequest).subscribe();

    const request = httpTesting.expectOne('http://localhost:8080/api/admin/tasks/task-id');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(taskRequest);
    request.flush(responseBody());
  });

  it('should add a test case', () => {
    service
      .addTestCase('task-id', {
        input: '1 2 3',
        expectedOutput: '2',
        hidden: false,
        orderIndex: 0,
      })
      .subscribe();

    const request = httpTesting.expectOne(
      'http://localhost:8080/api/admin/tasks/task-id/test-cases',
    );
    expect(request.request.method).toBe('POST');
    request.flush({
      id: 'case-id',
      taskId: 'task-id',
      input: '1 2 3',
      expectedOutput: '2',
      hidden: false,
      orderIndex: 0,
      createdAt: '2026-05-25T00:00:00Z',
    });
  });

  it('should publish and archive a task', () => {
    service.publishTask('task-id').subscribe();
    service.archiveTask('task-id').subscribe();

    const publish = httpTesting.expectOne('http://localhost:8080/api/admin/tasks/task-id/publish');
    expect(publish.request.method).toBe('POST');
    publish.flush(responseBody({ status: 'PUBLISHED' }));

    const archive = httpTesting.expectOne('http://localhost:8080/api/admin/tasks/task-id/archive');
    expect(archive.request.method).toBe('POST');
    archive.flush(responseBody({ status: 'ARCHIVED' }));
  });

  function responseBody(overrides: Partial<Record<string, unknown>> = {}) {
    return {
      id: 'task-id',
      ...taskRequest,
      createdAt: '2026-05-25T00:00:00Z',
      updatedAt: '2026-05-25T00:00:00Z',
      testCases: [],
      ...overrides,
    };
  }
});
