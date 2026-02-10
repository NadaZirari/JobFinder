import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { FavoriteService } from '../../services/favorite.service';
import * as FavoritesActions from './favorites.actions';
import { Favorite } from '../../models/favorite.model';

@Injectable()
export class FavoritesEffects {
  constructor(
    private actions$: Actions,
    private favoriteService: FavoriteService
  ) {}

  loadFavorites$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FavoritesActions.loadFavorites),
      mergeMap(() =>
        this.favoriteService.getFavorites().pipe(
          map((favorites: Favorite[]) => FavoritesActions.loadFavoritesSuccess({ favorites })),
          catchError(error => of(FavoritesActions.loadFavoritesFailure({ error: error.message })))
        )
      )
    );
  });

  addFavorite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FavoritesActions.addFavorite),
      mergeMap(({ job }) =>
        this.favoriteService.addToFavorites(job).pipe(
          map((favorite: Favorite) => FavoritesActions.addFavoriteSuccess({ favorite })),
          catchError(error => of(FavoritesActions.addFavoriteFailure({ error: error.message })))
        )
      )
    );
  });

  removeFavorite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FavoritesActions.removeFavorite),
      mergeMap(({ offerId }) =>
        this.favoriteService.removeFromFavorites(offerId).pipe(
          map(() => FavoritesActions.removeFavoriteSuccess({ offerId })),
          catchError(error => of(FavoritesActions.removeFavoriteFailure({ error: error.message })))
        )
      )
    );
  });

  checkFavoriteStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FavoritesActions.checkFavoriteStatus),
      mergeMap(({ offerId }) =>
        this.favoriteService.isFavorite(offerId).pipe(
          map((isFavorite: boolean) => FavoritesActions.checkFavoriteStatusSuccess({ offerId, isFavorite })),
          catchError(error => of(FavoritesActions.checkFavoriteStatusFailure({ error: error.message })))
        )
      )
    );
  });
}
