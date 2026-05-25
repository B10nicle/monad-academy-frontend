import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../core/api/api-config';
import { PageResponse } from '../../core/api/page-response';
import { paginationParams, PaginationRequest } from '../../core/api/pagination';
import { PublicTask, PublicTaskSummary } from './task.models';

@Injectable({
  providedIn: 'root',
})
export class TasksApiService {
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly http = inject(HttpClient);

  listTasks(request: PaginationRequest): Observable<PageResponse<PublicTaskSummary>> {
    return this.http.get<PageResponse<PublicTaskSummary>>(`${this.apiBaseUrl}/api/tasks`, {
      params: paginationParams(request),
    });
  }

  getTask(slug: string): Observable<PublicTask> {
    return this.http.get<PublicTask>(`${this.apiBaseUrl}/api/tasks/${slug}`);
  }
}
