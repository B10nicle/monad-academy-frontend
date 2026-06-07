import { Injectable, signal } from '@angular/core';

import { ApiError } from '../api/api-error';
import { AppLocale, TranslationParams } from './i18n.types';
import { TRANSLATIONS } from './translations';

const STORAGE_KEY = 'monad-academy.locale';
const FALLBACK_LOCALE: AppLocale = 'en';
const SUPPORTED_LOCALES: readonly AppLocale[] = ['en', 'ru'];

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  readonly locale = signal<AppLocale>(this.readInitialLocale());

  setLocale(locale: AppLocale): void {
    this.locale.set(locale);
    this.writeLocale(locale);
  }

  toggleLocale(): void {
    this.setLocale(this.locale() === 'en' ? 'ru' : 'en');
  }

  t(key: string, params: TranslationParams = {}): string {
    const locale = this.locale();
    const template = TRANSLATIONS[locale][key] ?? TRANSLATIONS[FALLBACK_LOCALE][key] ?? key;

    return template.replace(/\{\{?\s*(\w+)\s*\}?\}/g, (match, paramName: string) => {
      const value = params[paramName];
      return value === undefined ? match : String(value);
    });
  }

  translate(key: string, params: TranslationParams = {}): string {
    return this.t(key, params);
  }

  translateBackendMessage(
    response: { code?: string | null; message?: string | null },
    fallbackKey: string,
  ): string {
    if (response.code) {
      const translated = this.t(`api.${response.code}`);
      if (translated !== `api.${response.code}`) {
        return translated;
      }
    }

    const fallback = this.t(fallbackKey);
    return fallback === fallbackKey ? (response.message ?? this.t('api.error.generic')) : fallback;
  }

  translateApiError(error: ApiError, fallbackKey: string): string {
    if (error.code) {
      const translated = this.t(`api.${error.code}`);
      if (translated !== `api.${error.code}`) {
        return translated;
      }
    }

    if (error.status === 401) {
      return this.t('api.UNAUTHORIZED');
    }

    if (error.status === 403) {
      return this.t('api.error.forbidden');
    }

    const fallback = this.t(fallbackKey);
    return fallback === fallbackKey ? error.message : fallback;
  }

  private readInitialLocale(): AppLocale {
    const stored = this.readStoredLocale();
    if (stored) {
      return stored;
    }

    const browserLocale = globalThis.navigator?.language?.slice(0, 2).toLowerCase();
    return isSupportedLocale(browserLocale) ? browserLocale : FALLBACK_LOCALE;
  }

  private readStoredLocale(): AppLocale | null {
    try {
      const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
      return isSupportedLocale(stored) ? stored : null;
    } catch {
      return null;
    }
  }

  private writeLocale(locale: AppLocale): void {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, locale);
    } catch {
      // Some browser privacy modes can block localStorage; language switching still works in memory.
    }
  }
}

function isSupportedLocale(locale: string | null | undefined): locale is AppLocale {
  return SUPPORTED_LOCALES.includes(locale as AppLocale);
}
