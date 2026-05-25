import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { adminGuard } from './admin.guard';
import { authGuard } from './auth.guard';
import { guestGuard } from './guest.guard';
import { SessionService } from './session.service';

describe('auth guards', () => {
  const state = { url: '/submissions' } as RouterStateSnapshot;
  const route = {} as ActivatedRouteSnapshot;

  let router: Router;
  let authenticated: boolean;
  let admin: boolean;

  beforeEach(() => {
    authenticated = false;
    admin = false;

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: SessionService,
          useValue: {
            isAuthenticated: () => authenticated,
            isAdmin: () => admin,
          },
        },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should redirect unauthenticated users from authenticated routes', () => {
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toEqual(
      router.createUrlTree(['/login'], {
        queryParams: {
          redirectTo: '/submissions',
        },
      }),
    );
  });

  it('should allow authenticated users', () => {
    authenticated = true;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBe(true);
  });

  it('should allow admin users into admin routes', () => {
    authenticated = true;
    admin = true;

    const result = TestBed.runInInjectionContext(() => adminGuard(route, state));

    expect(result).toBe(true);
  });

  it('should redirect authenticated guests away from guest routes', () => {
    authenticated = true;

    const result = TestBed.runInInjectionContext(() => guestGuard(route, state));

    expect(result).toEqual(router.createUrlTree(['/tasks']));
  });
});
