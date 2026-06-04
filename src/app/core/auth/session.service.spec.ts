import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../api/api-config';
import { AuthTokenStorage } from './auth-token-storage';
import { CurrentUser } from './current-user.model';
import { SessionService } from './session.service';

describe('SessionService', () => {
  const user: CurrentUser = {
    id: 4,
    email: 'user@example.com',
    username: 'user',
    role: 'USER',
    status: 'ACTIVE',
  };

  let httpTesting: HttpTestingController;
  let service: SessionService;
  let tokenStorage: AuthTokenStorage;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: API_BASE_URL,
          useValue: 'http://localhost:8080',
        },
      ],
    });

    TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SessionService);
    tokenStorage = TestBed.inject(AuthTokenStorage);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should load current user and mark session authenticated', async () => {
    const result = service.loadCurrentUser();

    const request = httpTesting.expectOne('http://localhost:8080/api/users/me');
    request.flush(user);

    await expect(result).resolves.toEqual(user);
    expect(service.currentUser()).toEqual(user);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear token and user on logout', () => {
    tokenStorage.setToken('token');
    service.setCurrentUser(user);

    service.logout();

    expect(tokenStorage.token()).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
