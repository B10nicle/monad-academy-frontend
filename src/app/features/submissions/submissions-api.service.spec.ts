import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../../core/api/api-config';
import { SubmissionsApiService } from './submissions-api.service';

describe('SubmissionsApiService', () => {
  let httpTesting: HttpTestingController;
  let service: SubmissionsApiService;

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
    service = TestBed.inject(SubmissionsApiService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create a submission', () => {
    service.createSubmission({ taskId: 1, sourceCode: 'class Solution {}' }).subscribe();

    const request = httpTesting.expectOne('http://localhost:8080/api/submissions');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      taskId: 1,
      sourceCode: 'class Solution {}',
    });
    request.flush({
      id: 3,
      userId: 4,
      taskId: 1,
      sourceCode: 'class Solution {}',
      status: 'ACCEPTED',
      executionMetadata: '{}',
      executionDurationMs: 42,
      createdAt: '2026-05-25T00:00:00Z',
      updatedAt: '2026-05-25T00:00:00Z',
    });
  });

  it('should request current user submissions with pagination params', () => {
    service.listCurrentUserSubmissions({ page: 2, size: 15 }).subscribe();

    const request = httpTesting.expectOne(
      'http://localhost:8080/api/submissions/my?page=2&size=15',
    );
    expect(request.request.method).toBe('GET');
    request.flush({
      content: [],
      page: 2,
      size: 15,
      totalElements: 0,
      totalPages: 0,
    });
  });

  it('should request current user task submissions with pagination params', () => {
    service.listCurrentUserTaskSubmissions(1, { page: 1, size: 10 }).subscribe();

    const request = httpTesting.expectOne(
      'http://localhost:8080/api/tasks/1/submissions/my?page=1&size=10',
    );
    expect(request.request.method).toBe('GET');
    request.flush({
      content: [],
      page: 1,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    });
  });
});
