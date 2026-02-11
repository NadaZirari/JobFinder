import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application } from '../models/application.model';
import { Store } from '@ngrx/store';
import * as ApplicationsActions from '../store/applications/applications.actions';
import { selectIsApplicationTracked, selectApplicationsLoading } from '../store/applications/applications.selectors';
import { ApplicationService } from './application.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationWrapperService {
  constructor(
    private store: Store,
    private applicationService: ApplicationService
  ) {}

  addToApplications(job: any): Observable<any> {
    return this.applicationService.addApplication(job);
  }

  removeFromApplications(applicationId: string): Observable<any> {
    return this.applicationService.removeApplication(applicationId);
  }

  isApplicationTracked(offerId: string): Observable<boolean> {
    return this.applicationService.isApplicationTracked(offerId);
  }

  getApplications(): Observable<Application[]> {
    return this.applicationService.getApplications();
  }

  applicationsLoading(): Observable<boolean> {
    return this.store.select(selectApplicationsLoading);
  }
}
