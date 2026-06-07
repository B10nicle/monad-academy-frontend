import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiError } from '../../core/api/api-error';
import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { I18nService } from '../../core/i18n/i18n.service';
import { AuthApiService } from './auth-api.service';

@Component({
  selector: 'app-register-page',
  imports: [I18nPipe, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-copy">
        <p class="eyebrow">{{ 'auth.eyebrow.account' | t }}</p>
        <h1>{{ 'auth.register.title' | t }}</h1>
        <p class="supporting">{{ 'auth.register.supporting' | t }}</p>
      </div>

      <form class="auth-form" [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label for="email">{{ 'form.email' | t }}</label>
          <input id="email" type="email" formControlName="email" autocomplete="email" />
          @if (showRequiredError('email')) {
            <p class="field-error">{{ 'form.emailRequired' | t }}</p>
          } @else if (form.controls.email.hasError('email')) {
            <p class="field-error">{{ 'form.validEmail' | t }}</p>
          }
        </div>

        <div class="field">
          <label for="username">{{ 'form.username' | t }}</label>
          <input id="username" type="text" formControlName="username" autocomplete="username" />
          @if (showRequiredError('username')) {
            <p class="field-error">{{ 'form.usernameRequired' | t }}</p>
          }
        </div>

        <div class="field">
          <label for="password">{{ 'form.password' | t }}</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            autocomplete="new-password"
          />
          @if (showRequiredError('password')) {
            <p class="field-error">{{ 'form.passwordRequired' | t }}</p>
          }
        </div>

        @if (successMessage()) {
          <p class="api-success">{{ successMessage() }}</p>
        }
        @if (errorMessage()) {
          <p class="api-error">{{ errorMessage() }}</p>
        }

        <button class="submit-button" type="submit" [disabled]="form.invalid || submitting()">
          {{ submitting() ? ('auth.register.submitting' | t) : ('auth.register.submit' | t) }}
        </button>

        <div class="form-links">
          <a routerLink="/login">{{ 'auth.register.alreadyHaveAccount' | t }}</a>
          <a routerLink="/resend-verification">{{ 'auth.login.resendVerification' | t }}</a>
        </div>
      </form>
    </section>
  `,
  styleUrl: './auth-page.scss',
})
export class RegisterPage {
  private readonly authApi = inject(AuthApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly i18n = inject(I18nService);

  protected readonly submitting = signal(false);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.authApi.register(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.successMessage.set(
          this.i18n.translateBackendMessage(response, 'auth.register.success'),
        );
        this.form.reset();
        this.submitting.set(false);
      },
      error: (error: ApiError) => {
        this.errorMessage.set(this.i18n.translateApiError(error, 'api.error.generic'));
        this.submitting.set(false);
      },
    });
  }

  protected showRequiredError(controlName: 'email' | 'username' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.hasError('required') && (control.dirty || control.touched);
  }
}
