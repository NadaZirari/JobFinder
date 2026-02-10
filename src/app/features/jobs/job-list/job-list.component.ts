import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../core/models/job.model';
import { JobCardComponent } from '../job-card/job-card.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsFavorite, selectFavoritesLoading } from '../../../core/store/favorites/favorites.selectors';
import { selectIsApplicationTracked, selectApplicationsLoading } from '../../../core/store/applications/applications.selectors';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, JobCardComponent],
  template: `
    <div class="grid grid-cols-1 gap-6">
      <app-job-card
        *ngFor="let job of jobs; trackBy: trackByJobId"
        [job]="job"
        [isFavorite]="isFavorite$(job.id) | async"
        [isApplied]="isApplied$(job.id) | async"
        [favoritesLoading]="favoritesLoading$ | async"
        [applicationsLoading]="applicationsLoading$ | async"
        (onView)="onView.emit($event)"
        (onAddFavorite)="onAddFavorite.emit($event)"
        (onRemoveFavorite)="onRemoveFavorite.emit($event)"
        (onApply)="onApply.emit($event)"
        (onRemoveApplication)="onRemoveApplication.emit($event)"
      ></app-job-card>
    </div>
  `,
})
export class JobListComponent {
  @Input({ required: true }) jobs: Job[] = [];
  @Output() onView = new EventEmitter<Job>();
  @Output() onAddFavorite = new EventEmitter<Job>();
  @Output() onRemoveFavorite = new EventEmitter<string>();
  @Output() onApply = new EventEmitter<Job>();
  @Output() onRemoveApplication = new EventEmitter<string>();

  favoritesLoading$: Observable<boolean>;
  applicationsLoading$: Observable<boolean>;

  constructor(private store: Store) {
    this.favoritesLoading$ = this.store.select(selectFavoritesLoading);
    this.applicationsLoading$ = this.store.select(selectApplicationsLoading);
  }

  isFavorite$(offerId: string): Observable<boolean> {
    return this.store.select(selectIsFavorite(offerId));
  }

  isApplied$(offerId: string): Observable<boolean> {
    return this.store.select(selectIsApplicationTracked(offerId));
  }

  trackByJobId(index: number, job: Job): string {
    return job.id;
  }
}
