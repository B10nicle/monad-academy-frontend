import { inject } from '@angular/core';

import { SessionService } from './session.service';

export function initializeSession(): Promise<void> {
  return inject(SessionService).initialize();
}
