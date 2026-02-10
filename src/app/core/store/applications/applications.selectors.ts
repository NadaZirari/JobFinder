import { createSelector } from '@ngrx/store';
import { ApplicationsState } from './applications.reducer';
import { Application } from '../../models/application.model';

export const selectApplicationsState = (state: any) => state.applications;

export const selectApplications = createSelector(
  selectApplicationsState,
  (state: ApplicationsState) => state.applications
);

export const selectApplicationsLoading = createSelector(
  selectApplicationsState,
  (state: ApplicationsState) => state.loading
);

export const selectApplicationsError = createSelector(
  selectApplicationsState,
  (state: ApplicationsState) => state.error
);

export const selectApplicationStatuses = createSelector(
  selectApplicationsState,
  (state: ApplicationsState) => state.applicationStatuses
);

export const selectApplicationById = (applicationId: string) => createSelector(
  selectApplications,
  (applications: Application[]) =>
    applications.find((app: Application) => app.id === applicationId)
);

export const selectIsApplicationTracked = (offerId: string) => createSelector(
  selectApplicationStatuses,
  (statuses: { [offerId: string]: boolean }) => statuses[offerId] || false
);

export const selectApplicationsByStatus = (status: string) => createSelector(
  selectApplications,
  (applications: Application[]) =>
    applications.filter((app: Application) => app.status === status)
);

export const selectApplicationsCount = createSelector(
  selectApplications,
  (applications: Application[]) => applications.length
);

export const selectApplicationsByStatusCount = (status: string) => createSelector(
  selectApplicationsByStatus(status),
  (applications: Application[]) => applications.length
);
