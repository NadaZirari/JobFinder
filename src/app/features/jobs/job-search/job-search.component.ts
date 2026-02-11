import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil, map, startWith, debounceTime, distinctUntilChanged, switchMap, of, catchError, tap, shareReplay } from 'rxjs';
import { JobService, JobSearchParams, JobSearchResponse } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/services/auth.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { ApplicationService } from '../../../core/services/application.service';
import * as FavoritesActions from '../../../core/store/favorites/favorites.actions';
import * as ApplicationsActions from '../../../core/store/applications/applications.actions';
import { selectIsFavorite, selectFavoritesLoading } from '../../../core/store/favorites/favorites.selectors';
import { selectIsApplicationTracked, selectApplicationsLoading } from '../../../core/store/applications/applications.selectors';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css']
})
export class JobSearchComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  jobs$: Observable<JobSearchResponse>;
  isLoading = false;
  searchError: string | null = null;
  currentPage = 1;
  pageSize = 10;
  totalJobs = 0;
  totalPages = 0;
  
  private searchTerms = new Subject<JobSearchParams>();
  private destroy$ = new Subject<void>();
  isLoggedIn$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private authService: AuthService,
    private router: Router,
    private favoriteService: FavoriteService,
    private applicationService: ApplicationService,
    private store: Store
  ) {
    this.searchForm = this.fb.group({
      keywords: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', Validators.required]
    });

    this.isLoggedIn$ = this.authService.currentUser$.pipe(
      map(user => !!user)
    );

    this.jobs$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => 
        prev.keywords === curr.keywords && 
        prev.location === curr.location && 
        prev.page === curr.page
      ),
      switchMap(params => {
        this.isLoading = true;
        this.searchError = null;
        return this.jobService.searchJobs(params).pipe(
          tap(() => this.isLoading = false),
          catchError(err => {
            console.error('Search failed:', err);
            this.isLoading = false;
            this.searchError = 'Une erreur est survenue lors de la recherche. Veuillez réessayer.';
            return of<JobSearchResponse>({ results: [], count: 0, currentPage: 1, totalPages: 0 });
          })
        );
      }),
      shareReplay(1)
    );

    this.jobs$.pipe(
      startWith({ results: [], count: 0, currentPage: 1, totalPages: 0 }),
      takeUntil(this.destroy$)
    ).subscribe((response: JobSearchResponse) => {
      this.totalJobs = response.count;
      this.totalPages = response.totalPages;
      this.currentPage = response.currentPage;
    });
  }

  ngOnInit(): void {
    // Ne pas lancer de recherche automatiquement
    // Laisser l'utilisateur faire une recherche
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.markFormGroupTouched(this.searchForm);
      return;
    }

    const { keywords, location } = this.searchForm.value;
    this.currentPage = 1;
    
    this.searchTerms.next({
      keywords,
      location,
      page: this.currentPage,
      pageSize: this.pageSize
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    
    this.currentPage = page;
    const { keywords, location } = this.searchForm.value;
    
    this.searchTerms.next({
      keywords,
      location,
      page: this.currentPage,
      pageSize: this.pageSize
    });
  }

  viewJob(job: Job): void {
    window.open(job.url, '_blank');
  }

  addToFavorites(job: Job): void {
    console.log('addToFavorites appelé avec job:', job);
    
    if (!this.authService.isLoggedIn()) {
      console.log('Utilisateur non connecté, redirection vers login');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    console.log('Dispatch FavoritesActions.addFavorite');
    this.store.dispatch(FavoritesActions.addFavorite({ job }));
  }

  removeFromFavorites(offerId: string): void {
    console.log('removeFromFavorites appelé avec offerId:', offerId);
    this.store.dispatch(FavoritesActions.removeFavorite({ offerId }));
  }

  isFavorite$(offerId: string): Observable<boolean> {
    return this.store.select(selectIsFavorite(offerId));
  }

  favoritesLoading$(): Observable<boolean> {
    return this.store.select(selectFavoritesLoading);
  }

  addToApplications(job: Job): void {
    console.log('addToApplications appelé avec job:', job);
    
    if (!this.authService.isLoggedIn()) {
      console.log('Utilisateur non connecté, redirection vers login');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    console.log('Dispatch ApplicationsActions.addApplication');
    this.store.dispatch(ApplicationsActions.addApplication({ job }));
  }

  removeFromApplications(applicationId: string): void {
    console.log('removeFromApplications appelé avec applicationId:', applicationId);
    this.store.dispatch(ApplicationsActions.removeApplication({ applicationId }));
  }

  isApplicationTracked$(offerId: string): Observable<boolean> {
    return this.store.select(selectIsApplicationTracked(offerId));
  }

  applicationsLoading$(): Observable<boolean> {
    return this.store.select(selectApplicationsLoading);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  trackByJobId(index: number, job: Job): string {
    return job.id;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get keywords() { return this.searchForm.get('keywords'); }
  get location() { return this.searchForm.get('location'); }
}
