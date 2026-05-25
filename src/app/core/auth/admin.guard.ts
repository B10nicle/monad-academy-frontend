import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SessionService } from './session.service';

export const adminGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  if (session.isAdmin()) {
    return true;
  }

  if (!session.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: {
        redirectTo: state.url,
      },
    });
  }

  return router.createUrlTree(['/tasks']);
};
