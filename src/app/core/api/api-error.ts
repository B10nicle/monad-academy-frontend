import { HttpErrorResponse } from '@angular/common/http';

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof HttpErrorResponse) {
    const body = error.error;

    if (body && typeof body === 'object') {
      const record = body as Record<string, unknown>;

      return {
        status: error.status,
        message: readString(record['message']) ?? error.message,
        code: readString(record['code']),
        details: body,
      };
    }

    if (typeof body === 'string' && body.length > 0) {
      return {
        status: error.status,
        message: body,
      };
    }

    return {
      status: error.status,
      message: error.message,
    };
  }

  return {
    status: 0,
    message: 'Unexpected application error.',
    details: error,
  };
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}
