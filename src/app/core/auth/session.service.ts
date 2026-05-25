import { computed, Injectable, signal } from '@angular/core';

import { AuthTokenStorage } from './auth-token-storage';
import { CurrentUser } from './current-user.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly currentUserState = signal<CurrentUser | null>(null);

  readonly currentUser = this.currentUserState.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.currentUserState()));
  readonly isAdmin = computed(() => this.currentUserState()?.role === 'ADMIN');

  constructor(private readonly tokenStorage: AuthTokenStorage) {}

  setCurrentUser(user: CurrentUser): void {
    this.currentUserState.set(user);
  }

  logout(): void {
    this.tokenStorage.clearToken();
    this.currentUserState.set(null);
  }
}
