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

export const selectFavoriteStatuses = createSelector(
  selectFavoritesState,
  (state: FavoritesState) => state.favoriteStatuses
);

export const selectFavoriteByOfferId = (offerId: string) => createSelector(
  selectFavorites,
  (favorites: Favorite[]) =>
    favorites.find((fav: Favorite) => fav.offerId === offerId)
);

export const selectIsFavorite = (offerId: string) => createSelector(
  selectFavoriteStatuses,
  (statuses: { [offerId: string]: boolean }) => statuses[offerId] || false
);
