import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_BASE_URL } from '../api/api-config';
import { AuthTokenStorage } from './auth-token-storage';
import { CurrentUser } from './current-user.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(AuthTokenStorage);
  private readonly currentUserState = signal<CurrentUser | null>(null);
  private readonly initializedState = signal(false);

  readonly currentUser = this.currentUserState.asReadonly();
  readonly initialized = this.initializedState.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.currentUserState()));
  readonly isAdmin = computed(() => this.currentUserState()?.role === 'ADMIN');

  setCurrentUser(user: CurrentUser): void {
    this.currentUserState.set(user);
  }

  setAccessToken(token: string): void {
    this.tokenStorage.setToken(token);
  }

  async initialize(): Promise<void> {
    if (!this.tokenStorage.hasToken()) {
      this.initializedState.set(true);
      return;
    }

    try {
      await this.loadCurrentUser();
    } catch {
      this.tokenStorage.clearToken();
      this.currentUserState.set(null);
    } finally {
      this.initializedState.set(true);
    }
  }

  async loadCurrentUser(): Promise<CurrentUser> {
    const user = await firstValueFrom(
      this.http.get<CurrentUser>(`${this.apiBaseUrl}/api/users/me`),
    );
    this.currentUserState.set(user);
    return user;
  }

  logout(): void {
    this.tokenStorage.clearToken();
    this.currentUserState.set(null);
  }
}
