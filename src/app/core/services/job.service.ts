import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Job } from '../models/job.model';

export interface JobSearchParams {
  keywords: string;
  location: string;
  page?: number;
  pageSize?: number;
}

export interface JobSearchResponse {
  results: Job[];
  count: number;
  currentPage: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private readonly ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api';
  private readonly ADZUNA_APP_ID = '2fc7ffd3'; 
  private readonly ADZUNA_APP_KEY = '0200e6071135284953a0d47fa2ad3a22'; 
  private readonly ADZUNA_COUNTRY = 'fr'; 

  constructor(private http: HttpClient) {}

  searchJobs(params: JobSearchParams): Observable<JobSearchResponse> {
    const { keywords, location, page = 1, pageSize = 10 } = params;

    // Appel API Adzuna avec la bonne URL
    const url = `${this.ADZUNA_BASE_URL}/jobs/${this.ADZUNA_COUNTRY}/search/${page}`;
    const queryParams = {
      app_id: this.ADZUNA_APP_ID,
      app_key: this.ADZUNA_APP_KEY,
      what: keywords,
      where: location || 'France',
      results_per_page: pageSize.toString(),
      content_type: 'application/json'
    };

    return this.http.get<any>(url, { params: queryParams }).pipe(
      map(response => this.transformAdzunaResponse(response)),
      catchError(error => {
        console.error('Error fetching jobs from Adzuna API:', error);
        throw error; // Propager l'erreur comme exigé
      })
    );
  }

  private transformAdzunaResponse(response: any): JobSearchResponse {
    const jobs: Job[] = response.results.map((job: any) => ({
      id: job.id.toString(),
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      url: job.redirect_url,
      salary: job.salary ? `${job.salary.min}-${job.salary.max}` : 'Non spécifié',
      postedAt: new Date(job.created),
      apiSource: 'adzuna'
    }));

    return {
      results: jobs,
      count: response.count || jobs.length,
      currentPage: response.page || 1,
      totalPages: Math.ceil((response.count || jobs.length) / jobs.length)
    };
  }
}
