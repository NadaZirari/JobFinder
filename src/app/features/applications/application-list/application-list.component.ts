import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Application, ApplicationStatus } from '../../../core/models/application.model';
import { ApplicationService } from '../../../core/services/application.service';
import * as ApplicationsActions from '../../../core/store/applications/applications.actions';
import { 
  selectApplications, 
  selectApplicationsLoading, 
  selectApplicationsError,
  selectApplicationsByStatus,
  selectApplicationsCount,
  selectApplicationsByStatusCount
} from '../../../core/store/applications/applications.selectors';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})
export class ApplicationListComponent implements OnInit {
  applications$: Observable<Application[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  // Filtres par statut
  pendingApplications$: Observable<Application[]>;
  acceptedApplications$: Observable<Application[]>;
  rejectedApplications$: Observable<Application[]>;
  
  // Compteurs
  totalCount$: Observable<number>;
  pendingCount$: Observable<number>;
  acceptedCount$: Observable<number>;
  rejectedCount$: Observable<number>;
  
  // Formulaire pour modifier les notes
  notesForm: FormGroup;
  editingApplicationId: string | null = null;

  constructor(
    private store: Store,
    private applicationService: ApplicationService,
    private fb: FormBuilder
  ) {
    this.applications$ = this.store.select(selectApplications);
    this.loading$ = this.store.select(selectApplicationsLoading);
    this.error$ = this.store.select(selectApplicationsError);
    
    this.pendingApplications$ = this.store.select(selectApplicationsByStatus(ApplicationStatus.EN_ATTENTE));
    this.acceptedApplications$ = this.store.select(selectApplicationsByStatus(ApplicationStatus.ACCEPTE));
    this.rejectedApplications$ = this.store.select(selectApplicationsByStatus(ApplicationStatus.REFUSE));
    
    this.totalCount$ = this.store.select(selectApplicationsCount);
    this.pendingCount$ = this.store.select(selectApplicationsByStatusCount(ApplicationStatus.EN_ATTENTE));
    this.acceptedCount$ = this.store.select(selectApplicationsByStatusCount(ApplicationStatus.ACCEPTE));
    this.rejectedCount$ = this.store.select(selectApplicationsByStatusCount(ApplicationStatus.REFUSE));
    
    this.notesForm = this.fb.group({
      notes: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.store.dispatch(ApplicationsActions.loadApplications());
  }

  getStatusOptions() {
    return this.applicationService.getStatusOptions();
  }

  updateApplicationStatus(applicationId: string, status: ApplicationStatus): void {
    this.store.dispatch(ApplicationsActions.updateApplicationStatus({ applicationId, status }));
  }

  startEditingNotes(application: Application): void {
    this.editingApplicationId = application.id.toString();
    this.notesForm.patchValue({ notes: application.notes });
  }

  cancelEditingNotes(): void {
    this.editingApplicationId = null;
    this.notesForm.reset();
  }

  saveNotes(applicationId: string): void {
    if (this.notesForm.valid) {
      const notes = this.notesForm.get('notes')?.value || '';
      this.store.dispatch(ApplicationsActions.updateApplicationNotes({ applicationId, notes }));
      this.cancelEditingNotes();
    }
  }

  removeApplication(applicationId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      this.store.dispatch(ApplicationsActions.removeApplication({ applicationId }));
    }
  }

  viewJob(url: string): void {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  }

  getStatusColor(status: ApplicationStatus): string {
    const options = this.getStatusOptions();
    const option = options.find(opt => opt.value === status);
    return option ? option.color : 'gray';
  }

  getStatusLabel(status: ApplicationStatus): string {
    const options = this.getStatusOptions();
    const option = options.find(opt => opt.value === status);
    return option ? option.label : status;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
