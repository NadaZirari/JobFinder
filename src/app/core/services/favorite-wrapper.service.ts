import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import { Store } from '@ngrx/store';
import * as FavoritesActions from '../store/favorites/favorites.actions';
import { selectIsFavorite, selectFavoritesLoading } from '../store/favorites/favorites.selectors';
import { FavoriteService } from './favorite.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteWrapperService {
  constructor(
    private store: Store,
    private favoriteService: FavoriteService
  ) {}

  addToFavorites(job: any): Observable<any> {
    return this.favoriteService.addToFavorites(job);
  }

  removeFromFavorites(offerId: string): Observable<any> {
    return this.favoriteService.removeFromFavorites(offerId);
  }

  isFavorite(offerId: string): Observable<boolean> {
    return this.favoriteService.isFavorite(offerId);
  }

  getFavorites(): Observable<Favorite[]> {
    return this.favoriteService.getFavorites();
  }

  favoritesLoading(): Observable<boolean> {
    return this.store.select(selectFavoritesLoading);
  }
}
