import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../../core/api/api-config';
import { AdminSubmissionsApiService } from './admin-submissions-api.service';

describe('AdminSubmissionsApiService', () => {
  let httpTesting: HttpTestingController;
  let service: AdminSubmissionsApiService;

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
    service = TestBed.inject(AdminSubmissionsApiService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should request admin submissions with filters and pagination', () => {
    service
      .listSubmissions({
        userId: 'user-id',
        taskId: 'task-id',
        status: 'ACCEPTED',
        page: 2,
        size: 15,
      })
      .subscribe();

    const request = httpTesting.expectOne(
      'http://localhost:8080/api/admin/submissions?page=2&size=15&userId=user-id&taskId=task-id&status=ACCEPTED',
    );
    expect(request.request.method).toBe('GET');
    request.flush(pageResponse());
  });

  it('should request a specific user submission history', () => {
    service
      .listUserSubmissions('user-id', {
        taskId: 'task-id',
        status: 'WRONG_ANSWER',
        page: 1,
        size: 10,
      })
      .subscribe();

    const request = httpTesting.expectOne(
      'http://localhost:8080/api/admin/users/user-id/submissions?page=1&size=10&taskId=task-id&status=WRONG_ANSWER',
    );
    expect(request.request.method).toBe('GET');
    request.flush(pageResponse());
  });

  function pageResponse() {
    return {
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
    };
  }
});
