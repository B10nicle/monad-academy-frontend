import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { normalizeApiError } from './api-error';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  return next(request).pipe(catchError((error) => throwError(() => normalizeApiError(error))));
};
