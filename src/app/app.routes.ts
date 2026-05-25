import { Routes } from '@angular/router';

import { adminGuard } from './core/auth/admin.guard';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
import { AdminPlaceholder } from './features/admin/admin-placeholder';
import { LoginPage } from './features/auth/login-page';
import { RegisterPage } from './features/auth/register-page';
import { ResendVerificationPage } from './features/auth/resend-verification-page';
import { VerifyEmailPage } from './features/auth/verify-email-page';
import { SubmissionsPlaceholder } from './features/submissions/submissions-placeholder';
import { TaskDetailPlaceholder } from './features/tasks/task-detail-placeholder';
import { TasksPage } from './features/tasks/tasks-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tasks',
  },
  {
    path: 'tasks',
    component: TasksPage,
  },
  {
    path: 'tasks/:slug',
    component: TaskDetailPlaceholder,
  },
  {
    path: 'submissions',
    component: SubmissionsPlaceholder,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: AdminPlaceholder,
    canActivate: [adminGuard],
  },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: RegisterPage,
    canActivate: [guestGuard],
  },
  {
    path: 'verify-email',
    component: VerifyEmailPage,
    canActivate: [guestGuard],
  },
  {
    path: 'resend-verification',
    component: ResendVerificationPage,
    canActivate: [guestGuard],
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
