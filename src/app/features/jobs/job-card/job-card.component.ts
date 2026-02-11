import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-card p-6 hover:shadow-lg transition-all">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-slate-900 mb-2">{{ job.title }}</h3>
          <div class="flex items-center text-sm text-slate-600 mb-3">
            <span class="font-medium text-slate-800">{{ job.company }}</span>
            <span class="mx-2">•</span>
            <span>{{ job.location }}</span>
            <span *ngIf="job.salary" class="mx-2">•</span>
            <span *ngIf="job.salary" class="text-emerald-600 font-bold">{{ job.salary }}</span>
          </div>
          <p class="text-slate-600 mb-4 line-clamp-3">{{ job.description }}</p>
          <div class="text-sm text-slate-500">
            Postée le {{ job.postedAt | date:'dd/MM/yyyy' }}
          </div>
        </div>
        
        <div class="ml-4 flex flex-col space-y-2">
          <button
            (click)="onView()"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
          >
            Voir l'offre
          </button>
          
          <ng-container *ngIf="isLoggedIn">
            <button
              *ngIf="!isFavorite; else removeFavBtn"
              (click)="onToggleFavorite()"
              class="px-4 py-2 bg-yellow-400 text-white rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
            >
              ⭐ Favoris
            </button>
            <ng-template #removeFavBtn>
              <button
                (click)="onToggleFavorite()"
                class="px-4 py-2 bg-slate-100 text-yellow-600 border border-yellow-200 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-colors flex items-center justify-center gap-2"
              >
                ★ Favoris
              </button>
            </ng-template>
            
            <button
              *ngIf="!isTracked; else trackedBtn"
              (click)="onTrack()"
              class="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              📋 Suivre
            </button>
            <ng-template #trackedBtn>
              <button
                disabled
                class="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-sm font-bold opacity-80 cursor-default flex items-center justify-center gap-2"
              >
                ✓ Suivie
              </button>
            </ng-template>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
    }
  `]
})
export class JobCardComponent {
  @Input({ required: true }) job!: Job;
  @Input() isLoggedIn: boolean = false;
  @Input() isFavorite: boolean = false;
  @Input() isTracked: boolean = false;

  @Output() toggleFavorite = new EventEmitter<void>();
  @Output() track = new EventEmitter<void>();
  @Output() view = new EventEmitter<void>();

  onToggleFavorite(): void {
    this.toggleFavorite.emit();
  }

  onTrack(): void {
    this.track.emit();
  }

  onView(): void {
    this.view.emit();
  }
}
