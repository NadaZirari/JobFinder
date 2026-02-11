import { createAction, props } from '@ngrx/store';
import { Application, ApplicationStatus } from '../../models/application.model';

export const loadApplications = createAction('[Applications] Load Applications');
export const loadApplicationsSuccess = createAction('[Applications] Load Applications Success', props<{ applications: Application[] }>());
export const loadApplicationsFailure = createAction('[Applications] Load Applications Failure', props<{ error: string }>());

export const addApplication = createAction('[Applications] Add Application', props<{ job: any }>());
export const addApplicationSuccess = createAction('[Applications] Add Application Success', props<{ application: Application }>());
export const addApplicationFailure = createAction('[Applications] Add Application Failure', props<{ error: string }>());

export const updateApplicationStatus = createAction('[Applications] Update Application Status', props<{ applicationId: string; status: ApplicationStatus }>());
export const updateApplicationStatusSuccess = createAction('[Applications] Update Application Status Success', props<{ applicationId: string; status: ApplicationStatus }>());
export const updateApplicationStatusFailure = createAction('[Applications] Update Application Status Failure', props<{ error: string }>());

export const updateApplicationNotes = createAction('[Applications] Update Application Notes', props<{ applicationId: string; notes: string }>());
export const updateApplicationNotesSuccess = createAction('[Applications] Update Application Notes Success', props<{ application: Application }>());
export const updateApplicationNotesFailure = createAction('[Applications] Update Application Notes Failure', props<{ error: string }>());

export const removeApplication = createAction('[Applications] Remove Application', props<{ applicationId: string }>());
export const removeApplicationSuccess = createAction('[Applications] Remove Application Success', props<{ applicationId: string }>());
export const removeApplicationFailure = createAction('[Applications] Remove Application Failure', props<{ error: string }>());

export const checkApplicationStatus = createAction('[Applications] Check Application Status', props<{ offerId: string }>());
export const checkApplicationStatusSuccess = createAction('[Applications] Check Application Status Success', props<{ offerId: string; isTracked: boolean }>());
export const checkApplicationStatusFailure = createAction('[Applications] Check Application Status Failure', props<{ error: string }>());
