import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiError } from '../../core/api/api-error';
import { AuthApiService } from './auth-api.service';

@Component({
  selector: 'app-resend-verification-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-copy">
        <p class="eyebrow">Email verification</p>
        <h1>Resend verification</h1>
        <p class="supporting">Request a fresh verification link for an unverified account.</p>
      </div>

      <form class="auth-form" [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" autocomplete="email" />
          @if (showRequiredError()) {
            <p class="field-error">Email is required.</p>
          } @else if (form.controls.email.hasError('email')) {
            <p class="field-error">Enter a valid email.</p>
          }
        </div>

        @if (successMessage()) {
          <p class="api-success">{{ successMessage() }}</p>
        }
        @if (errorMessage()) {
          <p class="api-error">{{ errorMessage() }}</p>
        }

        <button class="submit-button" type="submit" [disabled]="form.invalid || submitting()">
          {{ submitting() ? 'Sending...' : 'Send verification link' }}
        </button>

        <div class="form-links">
          <a routerLink="/login">Back to login</a>
        </div>
      </form>
    </section>
  `,
  styleUrl: './auth-page.scss',
})
export class ResendVerificationPage {
  private readonly authApi = inject(AuthApiService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly submitting = signal(false);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.authApi.resendVerification(this.form.getRawValue()).subscribe({
      next: ({ message }) => {
        this.successMessage.set(message);
        this.submitting.set(false);
      },
      error: (error: ApiError) => {
        this.errorMessage.set(error.message);
        this.submitting.set(false);
      },
    });
  }

  protected showRequiredError(): boolean {
    const control = this.form.controls.email;
    return control.hasError('required') && (control.dirty || control.touched);
  }
}
