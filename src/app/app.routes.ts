import { Routes } from '@angular/router';

import { AdminPlaceholder } from './features/admin/admin-placeholder';
import { LoginPlaceholder } from './features/auth/login-placeholder';
import { SubmissionsPlaceholder } from './features/submissions/submissions-placeholder';
import { TasksPlaceholder } from './features/tasks/tasks-placeholder';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tasks',
  },
  {
    path: 'tasks',
    component: TasksPlaceholder,
  },
  {
    path: 'submissions',
    component: SubmissionsPlaceholder,
  },
  {
    path: 'admin',
    component: AdminPlaceholder,
  },
  {
    path: 'login',
    component: LoginPlaceholder,
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
