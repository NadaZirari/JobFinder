export interface Application {
  id: number | string;
  userId: string;
  offerId: string;
  apiSource: string;
  title: string;
  company: string;
  location: string;
  url: string;
  status: ApplicationStatus;
  notes: string;
  dateAdded: string;
}

export enum ApplicationStatus {
  EN_ATTENTE = 'en_attente',
  ACCEPTE = 'accepte',
  REFUSE = 'refuse'
}

export interface ApplicationStatusOption {
  value: ApplicationStatus;
  label: string;
  color: string;
}
