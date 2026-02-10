import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ApplicationService } from '../../services/application.service';
import * as ApplicationsActions from './applications.actions';
import { Application } from '../../models/application.model';

@Injectable()
export class ApplicationsEffects {
  constructor(
    private actions$: Actions,
    private applicationService: ApplicationService
  ) {}

  loadApplications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationsActions.loadApplications),
      mergeMap(() =>
        this.applicationService.getApplications().pipe(
          map((applications: Application[]) => ApplicationsActions.loadApplicationsSuccess({ applications })),
          catchError(error => of(ApplicationsActions.loadApplicationsFailure({ error: error.message })))
        )
      )
    );
  });

  addApplication$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationsActions.addApplication),
      mergeMap(({ job }) =>
        this.applicationService.addApplication(job).pipe(
          map((application: Application) => ApplicationsActions.addApplicationSuccess({ application })),
          catchError(error => of(ApplicationsActions.addApplicationFailure({ error: error.message })))
        )
      )
    );
  });

  updateApplicationStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationsActions.updateApplicationStatus),
      mergeMap(({ applicationId, status }) =>
        this.applicationService.updateApplicationStatus(applicationId, status).pipe(
          map((application: Application) => ApplicationsActions.updateApplicationStatusSuccess({ application })),
          catchError(error => of(ApplicationsActions.updateApplicationStatusFailure({ error: error.message })))
        )
      )
    );
  });

  updateApplicationNotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationsActions.updateApplicationNotes),
      mergeMap(({ applicationId, notes }) =>
        this.applicationService.updateApplicationNotes(applicationId, notes).pipe(
          map((application: Application) => ApplicationsActions.updateApplicationNotesSuccess({ application })),
          catchError(error => of(ApplicationsActions.updateApplicationNotesFailure({ error: error.message })))
        )
      )
    );
  });

  removeApplication$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationsActions.removeApplication),
      mergeMap(({ applicationId }) =>
        this.applicationService.removeApplication(applicationId).pipe(
          map(() => ApplicationsActions.removeApplicationSuccess({ applicationId })),
          catchError(error => of(ApplicationsActions.removeApplicationFailure({ error: error.message })))
        )
      )
    );
  });

  checkApplicationStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationsActions.checkApplicationStatus),
      mergeMap(({ offerId }) =>
        this.applicationService.isApplicationTracked(offerId).pipe(
          map((isTracked: boolean) => ApplicationsActions.checkApplicationStatusSuccess({ offerId, isTracked })),
          catchError(error => of(ApplicationsActions.checkApplicationStatusFailure({ error: error.message })))
        )
      )
    );
  });
}
