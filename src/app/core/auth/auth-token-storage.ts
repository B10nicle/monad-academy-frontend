import { Injectable, signal } from '@angular/core';

const TOKEN_STORAGE_KEY = 'monad-academy.access-token';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenStorage {
  private readonly tokenState = signal<string | null>(readStoredToken());

  readonly token = this.tokenState.asReadonly();
  readonly hasToken = () => Boolean(this.tokenState());

  setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    this.tokenState.set(token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.tokenState.set(null);
  }
}

function readStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}
