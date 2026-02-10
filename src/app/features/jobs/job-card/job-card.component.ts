import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-card p-6 hover:shadow-2xl transition-all duration-300 border-l-4 border-l-indigo-500 group">
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded">
              {{ job.apiSource || 'Direct' }}
            </span>
            <span class="text-xs text-slate-400 font-medium">
              Postée le {{ job.postedAt | date:'dd/MM/yyyy' }}
            </span>
          </div>
          
          <h3 class="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
            {{ job.title }}
          </h3>
          
          <div class="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
              </svg>
              <span class="font-semibold">{{ job.company }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ job.location }}</span>
            </div>
            <div *ngIf="job.salary" class="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ job.salary }}</span>
            </div>
          </div>
          
          <p class="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6">
            {{ job.description }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row md:flex-col gap-2 min-w-[160px]">
          <button (click)="onView.emit(job)" class="btn-primary flex items-center justify-center gap-2">
            <span>Détails</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
          
          <div class="grid grid-cols-2 gap-2">
            <button 
              (click)="isFavorite ? onRemoveFavorite.emit(job.id) : onAddFavorite.emit(job)"
              [disabled]="favoritesLoading"
              class="flex items-center justify-center p-2 rounded-lg transition-all border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
              [title]="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
              [ngClass]="{'bg-yellow-50 border-yellow-200 text-yellow-600': isFavorite}"
            >
              <svg class="w-5 h-5" [attr.fill]="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>

            <button 
              (click)="isApplied ? onRemoveApplication.emit(job.id) : onApply.emit(job)"
              [disabled]="applicationsLoading"
              class="flex items-center justify-center p-2 rounded-lg transition-all border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
              [title]="isApplied ? 'Arrêter le suivi' : 'Suivre la candidature'"
              [ngClass]="{'bg-emerald-50 border-emerald-200 text-emerald-600': isApplied}"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class JobCardComponent {
  @Input({ required: true }) job!: Job;
  @Input() isFavorite = false;
  @Input() isApplied = false;
  @Input() favoritesLoading = false;
  @Input() applicationsLoading = false;

  @Output() onView = new EventEmitter<Job>();
  @Output() onAddFavorite = new EventEmitter<Job>();
  @Output() onRemoveFavorite = new EventEmitter<string>();
  @Output() onApply = new EventEmitter<Job>();
  @Output() onRemoveApplication = new EventEmitter<string>();
}
