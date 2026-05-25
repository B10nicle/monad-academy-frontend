import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ApiError } from '../../core/api/api-error';
import { SessionService } from '../../core/auth/session.service';
import { AuthApiService } from './auth-api.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-copy">
        <p class="eyebrow">Account</p>
        <h1>Log in</h1>
        <p class="supporting">
          Continue to your task history, submissions, and protected practice workspace.
        </p>
      </div>

      <form class="auth-form" [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label for="login">Email or username</label>
          <input id="login" type="text" formControlName="login" autocomplete="username" />
          @if (showRequiredError('login')) {
            <p class="field-error">Login is required.</p>
          }
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            autocomplete="current-password"
          />
          @if (showRequiredError('password')) {
            <p class="field-error">Password is required.</p>
          }
        </div>

        @if (errorMessage()) {
          <p class="api-error">{{ errorMessage() }}</p>
        }

        <button class="submit-button" type="submit" [disabled]="form.invalid || submitting()">
          {{ submitting() ? 'Logging in...' : 'Log in' }}
        </button>

        <div class="form-links">
          <a routerLink="/register">Create account</a>
          <a routerLink="/resend-verification">Resend verification</a>
        </div>
      </form>
    </section>
  `,
  styleUrl: './auth-page.scss',
})
export class LoginPage {
  private readonly authApi = inject(AuthApiService);
  private readonly formBuilder = inject(FormBuilder);
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
          this.errorMessage.set('Could not load the current user.');
          this.submitting.set(false);
        }
      },
      error: (error: ApiError) => {
        this.errorMessage.set(readAuthErrorMessage(error));
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

function readAuthErrorMessage(error: ApiError): string {
  if (error.code === 'EMAIL_NOT_VERIFIED') {
    return 'Email is not verified. Verify your email or request a new verification link.';
  }

  if (error.code === 'USER_BLOCKED') {
    return 'This account is blocked.';
  }

  if (error.status === 401) {
    return 'Invalid login or password.';
  }

  return error.message;
}
