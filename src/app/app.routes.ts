import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  {
    path: 'jobs',
    loadComponent: () => import('./features/jobs/job-search/job-search.component').then(m => m.JobSearchComponent)
  },
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent) }
    ]
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites-list/favorites-list.component').then(m => m.FavoritesListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'applications',
    loadComponent: () => import('./features/applications/application-list/application-list.component').then(m => m.ApplicationListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./features/profile/profile-edit/profile-edit.component').then(m => m.ProfileEditComponent),
    canActivate: [AuthGuard]
  }
];
