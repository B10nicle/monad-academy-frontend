import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../core/api/api-config';
import { PageResponse } from '../../core/api/page-response';
import { PaginationRequest } from '../../core/api/pagination';
import { Submission } from '../submissions/submission.models';

export interface AdminSubmissionQuery extends PaginationRequest {
  userId?: string;
  taskId?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminSubmissionsApiService {
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly http = inject(HttpClient);

  listSubmissions(request: AdminSubmissionQuery = {}): Observable<PageResponse<Submission>> {
    return this.http.get<PageResponse<Submission>>(`${this.apiBaseUrl}/api/admin/submissions`, {
      params: adminSubmissionParams(request),
    });
  }

  listUserSubmissions(
    userId: string,
    request: Omit<AdminSubmissionQuery, 'userId'> = {},
  ): Observable<PageResponse<Submission>> {
    return this.http.get<PageResponse<Submission>>(
      `${this.apiBaseUrl}/api/admin/users/${userId}/submissions`,
      {
        params: adminSubmissionParams(request),
      },
    );
  }
}

function adminSubmissionParams(request: AdminSubmissionQuery): HttpParams {
  let params = new HttpParams()
    .set('page', String(request.page ?? 0))
    .set('size', String(request.size ?? 20));

  if (request.userId) {
    params = params.set('userId', request.userId);
  }

  if (request.taskId) {
    params = params.set('taskId', request.taskId);
  }

  if (request.status) {
    params = params.set('status', request.status);
  }

  return params;
}
