import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { authTokenInterceptor } from './auth-token.interceptor';
import { AuthTokenStorage } from './auth-token-storage';

describe('authTokenInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let tokenStorage: AuthTokenStorage;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    tokenStorage = TestBed.inject(AuthTokenStorage);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should attach bearer token when token exists', () => {
    tokenStorage.setToken('access-token');

    http.get('/api/users/me').subscribe();

    const request = httpTesting.expectOne('/api/users/me');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-token');
    request.flush({});
  });

  it('should not attach authorization header when token is missing', () => {
    http.get('/api/tasks').subscribe();

    const request = httpTesting.expectOne('/api/tasks');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });
});
