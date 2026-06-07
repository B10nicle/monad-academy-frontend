import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ApiError } from '../../core/api/api-error';
import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { I18nService } from '../../core/i18n/i18n.service';
import { AuthApiService } from './auth-api.service';

type VerifyState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-verify-email-page',
  imports: [I18nPipe, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-copy">
        <p class="eyebrow">{{ 'auth.eyebrow.emailVerification' | t }}</p>
        <h1>{{ 'auth.verify.title' | t }}</h1>
        <p class="supporting">{{ 'auth.verify.supporting' | t }}</p>
      </div>

      <div class="auth-form">
        @if (state() === 'loading') {
          <p class="supporting">{{ 'auth.verify.loading' | t }}</p>
        } @else if (state() === 'success') {
          <p class="api-success">{{ message() }}</p>
          <div class="form-links">
            <a routerLink="/login">{{ 'auth.verify.goToLogin' | t }}</a>
          </div>
        } @else {
          <p class="api-error">{{ message() }}</p>
          <div class="form-links">
            <a routerLink="/resend-verification">{{ 'auth.verify.requestNewLink' | t }}</a>
            <a routerLink="/login">{{ 'auth.verify.backToLogin' | t }}</a>
          </div>
        }
      </div>
    </section>
  `,
  styleUrl: './auth-page.scss',
})
export class VerifyEmailPage implements OnInit {
  private readonly authApi = inject(AuthApiService);
  private readonly i18n = inject(I18nService);
  private readonly route = inject(ActivatedRoute);

  protected readonly state = signal<VerifyState>('loading');
  protected readonly message = signal('');

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.state.set('error');
      this.message.set(this.i18n.translate('auth.verify.missingToken'));
      return;
    }

    this.authApi.verifyEmail({ token }).subscribe({
      next: (response) => {
        this.state.set('success');
        this.message.set(this.i18n.translateBackendMessage(response, 'auth.verify.success'));
      },
      error: (error: ApiError) => {
        this.state.set('error');
        this.message.set(this.i18n.translateApiError(error, 'api.error.generic'));
      },
    });
  }
}
