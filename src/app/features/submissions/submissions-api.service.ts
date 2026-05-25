import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../core/api/api-config';
import { PageResponse } from '../../core/api/page-response';
import { paginationParams, PaginationRequest } from '../../core/api/pagination';
import { Submission, SubmissionRequest } from './submission.models';

@Injectable({
  providedIn: 'root',
})
export class SubmissionsApiService {
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly http = inject(HttpClient);

  createSubmission(request: SubmissionRequest): Observable<Submission> {
    return this.http.post<Submission>(`${this.apiBaseUrl}/api/submissions`, request);
  }

  listCurrentUserSubmissions(
    request: PaginationRequest = {},
  ): Observable<PageResponse<Submission>> {
    return this.http.get<PageResponse<Submission>>(`${this.apiBaseUrl}/api/submissions/my`, {
      params: paginationParams(request),
    });
  }

  listCurrentUserTaskSubmissions(
    taskId: string,
    request: PaginationRequest = {},
  ): Observable<PageResponse<Submission>> {
    return this.http.get<PageResponse<Submission>>(
      `${this.apiBaseUrl}/api/tasks/${taskId}/submissions/my`,
      {
        params: paginationParams(request),
      },
    );
  }
}
