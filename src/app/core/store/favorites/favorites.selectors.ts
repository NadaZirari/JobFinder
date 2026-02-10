import { createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';
import { Favorite } from '../../models/favorite.model';

export const selectFavoritesState = (state: any) => state.favorites;

export const selectFavorites = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.favorites
);

export const selectFavoritesLoading = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.loading
);

export const selectFavoritesError = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.error
);

export const selectFavoriteByOfferId = (offerId: string | number) => createSelector(
  selectFavorites,
  (favorites: Favorite[]) =>
    favorites.find((fav: Favorite) => fav.offerId === offerId)
);
