import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../core/api/api-config';
import {
  AuthResponse,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  ResendVerificationRequest,
  VerifyEmailRequest,
} from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly http = inject(HttpClient);

  register(request: RegisterRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiBaseUrl}/api/auth/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/api/auth/login`, request);
  }

  verifyEmail(request: VerifyEmailRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiBaseUrl}/api/auth/verify-email`, request);
  }

  resendVerification(request: ResendVerificationRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${this.apiBaseUrl}/api/auth/resend-verification`,
      request,
    );
  }
}
