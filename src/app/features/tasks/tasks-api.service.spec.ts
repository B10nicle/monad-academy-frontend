import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../../core/api/api-config';
import { TasksApiService } from './tasks-api.service';

describe('TasksApiService', () => {
  let httpTesting: HttpTestingController;
  let service: TasksApiService;

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
    service = TestBed.inject(TasksApiService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should request public tasks with pagination params', () => {
    service.listTasks({ page: 2, size: 10 }).subscribe();

    const request = httpTesting.expectOne('http://localhost:8080/api/tasks?page=2&size=10');
    expect(request.request.method).toBe('GET');
    request.flush({
      content: [],
      page: 2,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    });
  });
});
