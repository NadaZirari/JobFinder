import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                JobFinder
              </span>
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <a routerLink="/jobs" routerLinkActive="text-indigo-600" [routerLinkActiveOptions]="{exact: true}" class="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Offres</a>
            <ng-container *ngIf="authService.currentUser$ | async as user">
              <a routerLink="/favorites" routerLinkActive="text-indigo-600" class="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Favoris</a>
              <a routerLink="/applications" routerLinkActive="text-indigo-600" class="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Candidatures</a>
            </ng-container>
          </nav>

          <!-- User Actions -->
          <div class="flex items-center space-x-4">
            <ng-container *ngIf="authService.currentUser$ | async as user; else loginBtn">
              <div class="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div class="text-right hidden sm:block">
                  <p class="text-xs font-semibold text-slate-900">{{ user.firstName }} {{ user.lastName }}</p>
                  <button (click)="authService.logout()" class="text-[10px] text-slate-500 hover:text-red-600 transition-colors">Déconnexion</button>
                </div>
                <a routerLink="/profile" class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:ring-2 hover:ring-indigo-600 transition-all overflow-hidden">
                  <span class="text-indigo-600 font-bold" *ngIf="user.firstName && user.lastName">{{ user.firstName[0] }}{{ user.lastName[0] }}</span>
                </a>
              </div>
            </ng-container>
            <ng-template #loginBtn>
              <div class="flex items-center space-x-3">
                <a routerLink="/auth/login" class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Connexion</a>
                <a routerLink="/auth/register" class="btn-primary py-1.5 px-4 text-sm">S'inscrire</a>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
}
