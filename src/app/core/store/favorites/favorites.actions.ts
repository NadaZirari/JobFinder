import { createAction, props } from '@ngrx/store';
import { Favorite } from '../../models/favorite.model';

export const loadFavorites = createAction('[Favorites] Load Favorites');
export const loadFavoritesSuccess = createAction('[Favorites] Load Favorites Success', props<{ favorites: Favorite[] }>());
export const loadFavoritesFailure = createAction('[Favorites] Load Favorites Failure', props<{ error: string }>());

export const addFavorite = createAction('[Favorites] Add Favorite', props<{ job: any }>());
export const addFavoriteSuccess = createAction('[Favorites] Add Favorite Success', props<{ favorite: Favorite }>());
export const addFavoriteFailure = createAction('[Favorites] Add Favorite Failure', props<{ error: string }>());

export const removeFavorite = createAction('[Favorites] Remove Favorite', props<{ offerId: string }>());
export const removeFavoriteSuccess = createAction('[Favorites] Remove Favorite Success', props<{ offerId: string }>());
export const removeFavoriteFailure = createAction('[Favorites] Remove Favorite Failure', props<{ error: string }>());

export const checkFavoriteStatus = createAction('[Favorites] Check Favorite Status', props<{ offerId: string }>());
export const checkFavoriteStatusSuccess = createAction('[Favorites] Check Favorite Status Success', props<{ offerId: string; isFavorite: boolean }>());
export const checkFavoriteStatusFailure = createAction('[Favorites] Check Favorite Status Failure', props<{ error: string }>());
