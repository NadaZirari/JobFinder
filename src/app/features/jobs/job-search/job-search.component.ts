import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil, map, startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { JobService, JobSearchParams, JobSearchResponse } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/services/auth.service';
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
    private store: Store
  ) {
    this.searchForm = this.fb.group({
      keywords: ['', Validators.required],
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
        return this.jobService.searchJobs(params);
      })
    );

    this.jobs$.pipe(
      startWith({ results: [], count: 0, currentPage: 1, totalPages: 0 }),
      takeUntil(this.destroy$)
    ).subscribe((response: JobSearchResponse) => {
      this.totalJobs = response.count;
      this.totalPages = response.totalPages;
      this.currentPage = response.currentPage;
      this.isLoading = false;
      
      // Vérifier le statut de favoris pour chaque offre
      response.results.forEach((job: Job) => {
        this.store.dispatch(FavoritesActions.checkFavoriteStatus({ offerId: job.id.toString() }));
        this.store.dispatch(ApplicationsActions.checkApplicationStatus({ offerId: job.id.toString() }));
      });
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
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    
    this.store.dispatch(FavoritesActions.addFavorite({ job }));
  }

  removeFromFavorites(offerId: string): void {
    this.store.dispatch(FavoritesActions.removeFavorite({ offerId }));
  }

  isFavorite$(offerId: string): Observable<boolean> {
    return this.store.select(selectIsFavorite(offerId));
  }

  favoritesLoading$(): Observable<boolean> {
    return this.store.select(selectFavoritesLoading);
  }

  addToApplications(job: Job): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    
    this.store.dispatch(ApplicationsActions.addApplication({ job }));
  }

  removeFromApplications(applicationId: string): void {
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
