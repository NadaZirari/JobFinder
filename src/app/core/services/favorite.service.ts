import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Favorite } from '../models/favorite.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getFavorites(): Observable<Favorite[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }

    return this.http.get<Favorite[]>(`${this.API_URL}/favoritesOffers`).pipe(
      map(favorites => favorites.filter(fav => fav.userId === currentUser.id)),
      catchError(error => {
        console.error('Error fetching favorites:', error);
        return of([]);
      })
    );
  }

  addToFavorites(job: any): Observable<Favorite> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    // Vérifier si l'offre est déjà en favoris
    return this.http.get<Favorite[]>(`${this.API_URL}/favoritesOffers`).pipe(
      map(favorites => favorites.filter(fav => 
        fav.userId === currentUser.id && fav.offerId === job.id.toString()
      )),
      switchMap(existingFavorites => {
        if (existingFavorites.length > 0) {
          throw new Error('Cette offre est déjà dans vos favoris');
        }

        const favorite: Favorite = {
          id: '', // Sera généré par JSON Server
          userId: currentUser.id,
          offerId: job.id.toString(),
          title: job.title,
          company: job.company,
          location: job.location
        };

        return this.http.post<Favorite>(`${this.API_URL}/favoritesOffers`, favorite);
      }),
      catchError(error => {
        console.error('Error adding to favorites:', error);
        throw error;
      })
    );
  }

  removeFromFavorites(offerId: string): Observable<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    return this.http.get<Favorite[]>(`${this.API_URL}/favoritesOffers`).pipe(
      map(favorites => favorites.find(fav => 
        fav.userId === currentUser.id && fav.offerId === offerId
      )),
      switchMap(favoriteToDelete => {
        if (!favoriteToDelete) {
          throw new Error('Favori non trouvé');
        }
        return this.http.delete<void>(`${this.API_URL}/favoritesOffers/${favoriteToDelete.id}`);
      }),
      catchError(error => {
        console.error('Error removing from favorites:', error);
        throw error;
      })
    );
  }

  isFavorite(offerId: string): Observable<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of(false);
    }

    return this.http.get<Favorite[]>(`${this.API_URL}/favoritesOffers`).pipe(
      map(favorites => favorites.some(fav => 
        fav.userId === currentUser.id && fav.offerId === offerId
      )),
      catchError(error => {
        console.error('Error checking favorite status:', error);
        return of(false);
      })
    );
  }
}
