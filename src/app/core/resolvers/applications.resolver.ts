import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { take, filter, first } from 'rxjs/operators';
import * as ApplicationsActions from '../store/applications/applications.actions';
import { selectApplicationsLoaded } from '../store/applications/applications.selectors';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsResolver implements Resolve<boolean> {
  constructor(private store: Store) {}

  resolve(): Observable<boolean> {
    this.store.dispatch(ApplicationsActions.loadApplications());
    
    // On attend que les données soient chargées avant de résoudre la route
    return this.store.select(selectApplicationsLoaded).pipe(
      filter(loaded => loaded),
      first()
    );
  }
}
