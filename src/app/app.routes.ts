import { Routes } from '@angular/router';

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'jobs',
    pathMatch: 'full'
  },
  {
    path: 'jobs',
    loadChildren: () =>
      import('./jobs/jobs.routes').then(m => m.JOBS_ROUTES)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(c => c.RegisterComponent)
  }
];
