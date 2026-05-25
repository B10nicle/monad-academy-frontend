import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { apiErrorInterceptor } from './core/api/api-error.interceptor';
import { API_BASE_URL } from './core/api/api-config';
import { authTokenInterceptor } from './core/auth/auth-token.interceptor';
import { initializeSession } from './core/auth/session-initializer';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor, apiErrorInterceptor])),
    {
      provide: API_BASE_URL,
      useValue: environment.apiBaseUrl,
    },
    provideAppInitializer(initializeSession),
  ],
};
