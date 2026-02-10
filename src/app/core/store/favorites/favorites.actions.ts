import { createAction, props } from '@ngrx/store';
import { Favorite } from '../../models/favorite.model';

export const loadFavorites = createAction('[Favorites] Load Favorites');
export const loadFavoritesSuccess = createAction('[Favorites] Load Favorites Success', props<{ favorites: Favorite[] }>());
export const loadFavoritesFailure = createAction('[Favorites] Load Favorites Failure', props<{ error: string }>());

export const addFavorite = createAction('[Favorites] Add Favorite', props<{ favorite: Favorite }>());
export const removeFavorite = createAction('[Favorites] Remove Favorite', props<{ offerId: string | number }>());
