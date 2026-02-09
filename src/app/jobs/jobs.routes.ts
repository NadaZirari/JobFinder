import { Routes } from '@angular/router';
import { JobSearchComponent } from './job-search/job-search.component';

export const JOBS_ROUTES: Routes = [
  {
    path: '',
    component: JobSearchComponent
  }
];
