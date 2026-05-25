import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../core/api/api-config';
import {
  TaskRequest,
  TaskResponse,
  TaskTestCaseRequest,
  TaskTestCaseResponse,
} from './admin-task.models';

@Injectable({
  providedIn: 'root',
})
export class AdminTasksApiService {
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly http = inject(HttpClient);

  createTask(request: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.apiBaseUrl}/api/admin/tasks`, request);
  }

  updateTask(id: string, request: TaskRequest): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiBaseUrl}/api/admin/tasks/${id}`, request);
  }

  addTestCase(id: string, request: TaskTestCaseRequest): Observable<TaskTestCaseResponse> {
    return this.http.post<TaskTestCaseResponse>(
      `${this.apiBaseUrl}/api/admin/tasks/${id}/test-cases`,
      request,
    );
  }

  publishTask(id: string): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.apiBaseUrl}/api/admin/tasks/${id}/publish`, {});
  }

  archiveTask(id: string): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.apiBaseUrl}/api/admin/tasks/${id}/archive`, {});
  }
}
