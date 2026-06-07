import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ApiError } from '../../core/api/api-error';
import { SessionService } from '../../core/auth/session.service';
import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { I18nService } from '../../core/i18n/i18n.service';
import { AuthApiService } from './auth-api.service';

@Component({
  selector: 'app-login-page',
  imports: [I18nPipe, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-copy">
        <p class="eyebrow">{{ 'auth.eyebrow.account' | t }}</p>
        <h1>{{ 'auth.login.title' | t }}</h1>
        <p class="supporting">{{ 'auth.login.supporting' | t }}</p>
      </div>

      <form class="auth-form" [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label for="login">{{ 'auth.login.loginLabel' | t }}</label>
          <input id="login" type="text" formControlName="login" autocomplete="username" />
          @if (showRequiredError('login')) {
            <p class="field-error">{{ 'auth.login.loginRequired' | t }}</p>
          }
        </div>

        <div class="field">
          <label for="password">{{ 'form.password' | t }}</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            autocomplete="current-password"
          />
          @if (showRequiredError('password')) {
            <p class="field-error">{{ 'auth.login.passwordRequired' | t }}</p>
          }
        </div>

        @if (errorMessage()) {
          <p class="api-error">{{ errorMessage() }}</p>
        }

        <button class="submit-button" type="submit" [disabled]="form.invalid || submitting()">
          {{ submitting() ? ('auth.login.submitting' | t) : ('auth.login.submit' | t) }}
        </button>

        <div class="form-links">
          <a routerLink="/register">{{ 'auth.login.createAccount' | t }}</a>
          <a routerLink="/resend-verification">{{ 'auth.login.resendVerification' | t }}</a>
        </div>
      </form>
    </section>
  `,
  styleUrl: './auth-page.scss',
})
export class LoginPage {
  private readonly authApi = inject(AuthApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly i18n = inject(I18nService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.authApi.login(this.form.getRawValue()).subscribe({
      next: async ({ token }) => {
        try {
          this.session.setAccessToken(token);
          await this.session.loadCurrentUser();
          await this.router.navigateByUrl(this.redirectTarget());
        } catch {
          this.session.logout();
          this.errorMessage.set(this.i18n.translate('auth.login.currentUserError'));
          this.submitting.set(false);
        }
      },
      error: (error: ApiError) => {
        this.errorMessage.set(this.i18n.translateApiError(error, 'auth.login.invalidCredentials'));
        this.submitting.set(false);
      },
    });
  }

  protected showRequiredError(controlName: 'login' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.hasError('required') && (control.dirty || control.touched);
  }

  private redirectTarget(): string {
    return this.route.snapshot.queryParamMap.get('redirectTo') ?? '/tasks';
  }
}
