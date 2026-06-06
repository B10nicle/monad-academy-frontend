import { Injectable, inject } from '@angular/core';

import { ApiError } from '../api/api-error';
import { I18nService } from './i18n.service';

export interface ApiMessageResponse {
  code?: string | null;
  message?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ApiMessageTranslator {
  private readonly i18n = inject(I18nService);

  success(response: ApiMessageResponse): string {
    return this.byCode(response.code) ?? response.message ?? this.i18n.t('shared.tryAgain');
  }

  error(error: ApiError): string {
    if (error.code === 'EMAIL_NOT_VERIFIED' || error.code === 'USER_BLOCKED') {
      return this.byCode(error.code) ?? error.message;
    }

    if (error.status === 401) {
      return this.i18n.t('api.UNAUTHORIZED');
    }

    return this.byCode(error.code) ?? error.message;
  }

  private byCode(code: string | null | undefined): string | null {
    if (!code) {
      return null;
    }

    const translated = this.i18n.t(`api.${code}`);
    return translated === `api.${code}` ? null : translated;
  }
}
