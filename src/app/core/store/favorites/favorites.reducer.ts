import { createReducer, on } from '@ngrx/store';
import { addFavorite, removeFavorite, loadFavorites, loadFavoritesSuccess, loadFavoritesFailure } from './favorites.actions';
import { Favorite } from '../../models/favorite.model';

export interface FavoritesState {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
}

export const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null
};

export const favoritesReducer = createReducer(
  initialState,
  on(loadFavorites, state => ({ ...state, loading: true, error: null })),
  on(loadFavoritesSuccess, (state, { favorites }) => ({ 
    ...state, 
    loading: false, 
    favorites 
  })),
  on(loadFavoritesFailure, (state, { error }) => ({ 
    ...state, 
    loading: false, 
    error 
  })),
  on(addFavorite, (state, { favorite }) => ({
    ...state,
    favorites: [...state.favorites, favorite]
  })),
  on(removeFavorite, (state, { offerId }) => ({
    ...state,
    favorites: state.favorites.filter(fav => fav.offerId !== offerId)
  }))
);
