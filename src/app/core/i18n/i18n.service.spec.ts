import { TestBed } from '@angular/core/testing';

import { I18nService } from './i18n.service';

describe('I18nService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should persist selected locale', () => {
    const i18n = TestBed.inject(I18nService);

    i18n.setLocale('ru');

    expect(i18n.locale()).toBe('ru');
    expect(localStorage.getItem('monad-academy.locale')).toBe('ru');
    expect(i18n.translate('app.nav.tasks')).toBe('Задачи');
  });

  it('should translate backend success code before legacy message', () => {
    const i18n = TestBed.inject(I18nService);

    i18n.setLocale('ru');

    expect(
      i18n.translateBackendMessage(
        {
          code: 'REGISTRATION_COMPLETED',
          message: 'Registration completed.',
        },
        'auth.register.success',
      ),
    ).toBe('Регистрация завершена. Проверьте email, чтобы подтвердить аккаунт.');
  });

  it('should translate known API error codes', () => {
    const i18n = TestBed.inject(I18nService);

    i18n.setLocale('ru');

    expect(
      i18n.translateApiError(
        {
          status: 400,
          code: 'EMAIL_NOT_VERIFIED',
          message: 'Email is not verified.',
        },
        'api.error.generic',
      ),
    ).toBe('Email не подтвержден. Подтвердите email или запросите новую ссылку.');
  });
});
