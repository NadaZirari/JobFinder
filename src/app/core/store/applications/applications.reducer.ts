import { createReducer, on } from '@ngrx/store';
import { 
  loadApplications, 
  loadApplicationsSuccess, 
  loadApplicationsFailure,
  addApplication, 
  addApplicationSuccess, 
  addApplicationFailure,
  updateApplicationStatus, 
  updateApplicationStatusSuccess, 
  updateApplicationStatusFailure,
  updateApplicationNotes, 
  updateApplicationNotesSuccess, 
  updateApplicationNotesFailure,
  removeApplication, 
  removeApplicationSuccess, 
  removeApplicationFailure,
  checkApplicationStatus,
  checkApplicationStatusSuccess,
  checkApplicationStatusFailure
} from './applications.actions';
import { Application } from '../../models/application.model';

export interface ApplicationsState {
  applications: Application[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  applicationStatuses: { [offerId: string]: boolean };
}

export const initialState: ApplicationsState = {
  applications: [],
  loading: false,
  loaded: false,
  error: null,
  applicationStatuses: {}
};

export const applicationsReducer = createReducer(
  initialState,
  on(loadApplications, state => ({ ...state, loading: true, error: null })),
  on(loadApplicationsSuccess, (state, { applications }) => ({ 
    ...state, 
    loading: false, 
    loaded: true,
    applications,
    error: null
  })),
  on(loadApplicationsFailure, (state, { error }) => ({ 
    ...state, 
    loading: false, 
    error 
  })),
  on(addApplication, state => ({ ...state, loading: true, error: null })),
  on(addApplicationSuccess, (state, { application }) => ({
    ...state,
    loading: false,
    applications: [...state.applications, application],
    applicationStatuses: { ...state.applicationStatuses, [application.offerId]: true },
    error: null
  })),
  on(addApplicationFailure, (state, { error }) => ({ 
    ...state, 
    loading: false, 
    error 
  })),
  on(updateApplicationStatus, state => ({ ...state, loading: true, error: null })),
  on(updateApplicationStatusSuccess, (state, { applicationId, status }) => ({
    ...state,
    loading: false,
    applications: state.applications.map(app => 
      app.id.toString() === applicationId.toString() ? { ...app, status } : app
    ),
    error: null
  })),
  on(updateApplicationStatusFailure, (state, { error }) => ({ 
    ...state, 
    loading: false, 
    error 
  })),
  on(updateApplicationNotes, state => ({ ...state, loading: true, error: null })),
  on(updateApplicationNotesSuccess, (state, { application }) => ({
    ...state,
    loading: false,
    applications: state.applications.map(app => 
      app.id.toString() === application.id.toString() ? application : app
    ),
    error: null
  })),
  on(updateApplicationNotesFailure, (state, { error }) => ({ 
    ...state, 
    loading: false, 
    error 
  })),
  on(removeApplication, state => ({ ...state, loading: true, error: null })),
  on(removeApplicationSuccess, (state, { applicationId }) => {
    const applicationToRemove = state.applications.find(app => app.id.toString() === applicationId.toString());
    const offerId = applicationToRemove?.offerId;
    
    return {
      ...state,
      loading: false,
      applications: state.applications.filter(app => app.id.toString() !== applicationId.toString()),
      applicationStatuses: offerId ? { ...state.applicationStatuses, [offerId]: false } : state.applicationStatuses,
      error: null
    };
  }),
  on(removeApplicationFailure, (state, { error }) => ({ 
    ...state, 
    loading: false, 
    error 
  })),
  on(checkApplicationStatus, state => ({ ...state, loading: true })),
  on(checkApplicationStatusSuccess, (state, { offerId, isTracked }) => ({
    ...state,
    loading: false,
    applicationStatuses: { ...state.applicationStatuses, [offerId]: isTracked }
  })),
  on(checkApplicationStatusFailure, (state, { error }) => ({ 
    ...state, 
    loading: false, 
    error 
  }))
);
