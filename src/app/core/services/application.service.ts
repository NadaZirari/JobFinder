import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Application, ApplicationStatus } from '../models/application.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getApplications(): Observable<Application[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }

    return this.http.get<Application[]>(`${this.API_URL}/applications`).pipe(
      map(applications => applications.filter(app => app.userId === currentUser.id)),
      catchError(error => {
        console.error('Error fetching applications:', error);
        return of([]);
      })
    );
  }

  addApplication(job: any): Observable<Application> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    // Vérifier si la candidature existe déjà
    return this.http.get<Application[]>(`${this.API_URL}/applications`).pipe(
      map(applications => applications.filter(app => 
        app.userId === currentUser.id && app.offerId === job.id.toString()
      )),
      switchMap(existingApplications => {
        if (existingApplications.length > 0) {
          throw new Error('Vous suivez déjà cette candidature');
        }

        const application: Application = {
          id: '', // Sera généré par JSON Server
          userId: currentUser.id,
          offerId: job.id.toString(),
          apiSource: job.apiSource || 'unknown',
          title: job.title,
          company: job.company,
          location: job.location,
          url: job.url || '#',
          status: ApplicationStatus.EN_ATTENTE,
          notes: '',
          dateAdded: new Date().toISOString()
        };

        return this.http.post<Application>(`${this.API_URL}/applications`, application);
      }),
      catchError(error => {
        console.error('Error adding application:', error);
        throw error;
      })
    );
  }

  updateApplicationStatus(applicationId: string, status: ApplicationStatus): Observable<Application> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    return this.http.get<Application[]>(`${this.API_URL}/applications`).pipe(
      map(applications => applications.find(app => 
        app.userId === currentUser.id && app.id === applicationId
      )),
      switchMap(applicationToUpdate => {
        if (!applicationToUpdate) {
          throw new Error('Candidature non trouvée');
        }
        
        return this.http.patch<Application>(`${this.API_URL}/applications/${applicationId}`, { status });
      }),
      catchError(error => {
        console.error('Error updating application status:', error);
        throw error;
      })
    );
  }

  updateApplicationNotes(applicationId: string, notes: string): Observable<Application> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    return this.http.get<Application[]>(`${this.API_URL}/applications`).pipe(
      map(applications => applications.find(app => 
        app.userId === currentUser.id && app.id === applicationId
      )),
      switchMap(applicationToUpdate => {
        if (!applicationToUpdate) {
          throw new Error('Candidature non trouvée');
        }
        
        return this.http.patch<Application>(`${this.API_URL}/applications/${applicationId}`, { notes });
      }),
      catchError(error => {
        console.error('Error updating application notes:', error);
        throw error;
      })
    );
  }

  removeApplication(applicationId: string): Observable<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    return this.http.get<Application[]>(`${this.API_URL}/applications`).pipe(
      map(applications => applications.find(app => 
        app.userId === currentUser.id && app.id === applicationId
      )),
      switchMap(applicationToDelete => {
        if (!applicationToDelete) {
          throw new Error('Candidature non trouvée');
        }
        return this.http.delete<void>(`${this.API_URL}/applications/${applicationId}`);
      }),
      catchError(error => {
        console.error('Error removing application:', error);
        throw error;
      })
    );
  }

  isApplicationTracked(offerId: string): Observable<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of(false);
    }

    return this.http.get<Application[]>(`${this.API_URL}/applications`).pipe(
      map(applications => applications.some(app => 
        app.userId === currentUser.id && app.offerId === offerId
      )),
      catchError(error => {
        console.error('Error checking application status:', error);
        return of(false);
      })
    );
  }

  getStatusOptions(): { value: ApplicationStatus; label: string; color: string }[] {
    return [
      { value: ApplicationStatus.EN_ATTENTE, label: 'En attente', color: 'yellow' },
      { value: ApplicationStatus.ACCEPTE, label: 'Accepté', color: 'green' },
      { value: ApplicationStatus.REFUSE, label: 'Refusé', color: 'red' }
    ];
  }
}
