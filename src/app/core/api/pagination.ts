import { HttpParams } from '@angular/common/http';

export interface PaginationRequest {
  page?: number;
  size?: number;
}

export function paginationParams(request: PaginationRequest = {}): HttpParams {
  return new HttpParams()
    .set('page', String(request.page ?? 0))
    .set('size', String(request.size ?? 20));
}
