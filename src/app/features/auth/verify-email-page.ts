import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ApiError } from '../../core/api/api-error';
import { AuthApiService } from './auth-api.service';

type VerifyState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-verify-email-page',
  imports: [RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-copy">
        <p class="eyebrow">Email verification</p>
        <h1>Verify email</h1>
        <p class="supporting">Confirm your email before signing in.</p>
      </div>

      <div class="auth-form">
        @if (state() === 'loading') {
          <p class="supporting">Verifying email...</p>
        } @else if (state() === 'success') {
          <p class="api-success">{{ message() }}</p>
          <div class="form-links">
            <a routerLink="/login">Go to login</a>
          </div>
        } @else {
          <p class="api-error">{{ message() }}</p>
          <div class="form-links">
            <a routerLink="/resend-verification">Request a new link</a>
            <a routerLink="/login">Back to login</a>
          </div>
        }
      </div>
    </section>
  `,
  styleUrl: './auth-page.scss',
})
export class VerifyEmailPage implements OnInit {
  private readonly authApi = inject(AuthApiService);
  private readonly route = inject(ActivatedRoute);

  protected readonly state = signal<VerifyState>('loading');
  protected readonly message = signal('Verifying email...');

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.state.set('error');
      this.message.set('Verification token is missing.');
      return;
    }

    this.authApi.verifyEmail({ token }).subscribe({
      next: ({ message }) => {
        this.state.set('success');
        this.message.set(message);
      },
      error: (error: ApiError) => {
        this.state.set('error');
        this.message.set(error.message);
      },
    });
  }
}
