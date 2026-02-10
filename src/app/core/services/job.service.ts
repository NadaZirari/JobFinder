import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  searchJobs(params: JobSearchParams): Observable<JobSearchResponse> {
    const { keywords, location, page = 1, pageSize = 10 } = params;
    
    // Pour le développement, nous allons simuler des données
    // En production, remplacez par l'appel API réel
    if (this.isDevelopment()) {
      return this.getMockJobs(params);
    }

    const url = `${this.ADZUNA_BASE_URL}/${location}/search/1`;
    const queryParams = {
  
      what: keywords,
      where: location,
      page: page.toString(),
      results_per_page: pageSize.toString()
    };

    return this.http.get<any>(url, { params: queryParams }).pipe(
      map(response => this.transformAdzunaResponse(response)),
      catchError(error => {
        console.error('Error fetching jobs:', error);
        return this.getMockJobs(params);
      })
    );
  }

  private isDevelopment(): boolean {
    return true; // Pour le développement, retourner true
  }

  private getMockJobs(params: JobSearchParams): Observable<JobSearchResponse> {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Développeur Angular Senior',
        company: 'TechCorp',
        location: 'Paris, France',
        description: 'Nous recherchons un développeur Angular expérimenté pour rejoindre notre équipe...',
        url: 'https://example.com/job/1',
        salary: '45k-65k€',
        postedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        title: 'Développeur Full Stack',
        company: 'StartupXYZ',
        location: 'Lyon, France',
        description: 'Rejoignez une startup innovante en tant que développeur full stack...',
        url: 'https://example.com/job/2',
        salary: '40k-55k€',
        postedAt: new Date('2024-01-14')
      },
      {
        id: '3',
        title: 'Ingénieur Logiciel',
        company: 'BigTech',
        location: 'Marseille, France',
        description: 'Poste d\'ingénieur logiciel avec des opportunités d\'évolution...',
        url: 'https://example.com/job/3',
        salary: '50k-70k€',
        postedAt: new Date('2024-01-13')
      }
    ];

    // Filtrer par mots-clés et localisation
    const filteredJobs = mockJobs.filter(job => {
      const matchesKeywords = !params.keywords || 
        job.title.toLowerCase().includes(params.keywords.toLowerCase()) ||
        job.description.toLowerCase().includes(params.keywords.toLowerCase());
      
      const matchesLocation = !params.location || 
        job.location.toLowerCase().includes(params.location.toLowerCase());

      return matchesKeywords && matchesLocation;
    });

    // Trier par date (plus récent en premier)
    filteredJobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

    const startIndex = (params.page || 1) - 1;
    const endIndex = startIndex + (params.pageSize || 10);
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    return of({
      results: paginatedJobs,
      count: filteredJobs.length,
      currentPage: params.page || 1,
      totalPages: Math.ceil(filteredJobs.length / (params.pageSize || 10))
    });
  }

  private transformAdzunaResponse(response: any): JobSearchResponse {
    const jobs: Job[] = response.results.map((job: any) => ({
      id: job.id.toString(),
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      url: job.redirect_url,
      salary: job.salary ? `${job.salary.min}-${job.salary.max}` : undefined,
      postedAt: new Date(job.created)
    }));

    return {
      results: jobs,
      count: response.count,
      currentPage: response.page || 1,
      totalPages: Math.ceil(response.count / (response.results?.length || 10))
    };
  }
}
