import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiError } from '../../core/api/api-error';
import { AuthApiService } from './auth-api.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-copy">
        <p class="eyebrow">Account</p>
        <h1>Create account</h1>
        <p class="supporting">
          Register to submit solutions and keep your personal attempt history.
        </p>
      </div>

      <form class="auth-form" [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" autocomplete="email" />
          @if (showRequiredError('email')) {
            <p class="field-error">Email is required.</p>
          } @else if (form.controls.email.hasError('email')) {
            <p class="field-error">Enter a valid email.</p>
          }
        </div>

        <div class="field">
          <label for="username">Username</label>
          <input id="username" type="text" formControlName="username" autocomplete="username" />
          @if (showRequiredError('username')) {
            <p class="field-error">Username is required.</p>
          }
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            autocomplete="new-password"
          />
          @if (showRequiredError('password')) {
            <p class="field-error">Password is required.</p>
          }
        </div>

        @if (successMessage()) {
          <p class="api-success">{{ successMessage() }}</p>
        }
        @if (errorMessage()) {
          <p class="api-error">{{ errorMessage() }}</p>
        }

        <button class="submit-button" type="submit" [disabled]="form.invalid || submitting()">
          {{ submitting() ? 'Creating account...' : 'Create account' }}
        </button>

        <div class="form-links">
          <a routerLink="/login">Already have an account?</a>
          <a routerLink="/resend-verification">Resend verification</a>
        </div>
      </form>
    </section>
  `,
  styleUrl: './auth-page.scss',
})
export class RegisterPage {
  private readonly authApi = inject(AuthApiService);
  private readonly formBuilder = inject(FormBuilder);

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
      next: ({ message }) => {
        this.successMessage.set(message);
        this.form.reset();
        this.submitting.set(false);
      },
      error: (error: ApiError) => {
        this.errorMessage.set(error.message);
        this.submitting.set(false);
      },
    });
  }

  protected showRequiredError(controlName: 'email' | 'username' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.hasError('required') && (control.dirty || control.touched);
  }
}
