import { createReducer, on } from '@ngrx/store';
import { 
  loadFavorites, 
  loadFavoritesSuccess, 
  loadFavoritesFailure,
  addFavorite, 
  addFavoriteSuccess, 
  addFavoriteFailure,
  removeFavorite, 
  removeFavoriteSuccess, 
  removeFavoriteFailure,
  checkFavoriteStatus,
  checkFavoriteStatusSuccess,
  checkFavoriteStatusFailure
} from './favorites.actions';
import { Favorite } from '../../models/favorite.model';

export interface FavoritesState {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  favoriteStatuses: { [offerId: string]: boolean };
}

export const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
  favoriteStatuses: {}
};

export const favoritesReducer = createReducer(
  initialState,
  on(loadFavorites, state => ({ ...state, loading: true, error: null })),
  on(loadFavoritesSuccess, (state, { favorites }) => ({ 
    ...state, 
    loading: false, 
    favorites,
    error: null
  })),
  on(loadFavoritesFailure, (state, { error }) => ({ 
    ...state, 
    loading: false, 
    error 
  })),
  on(addFavorite, state => ({ ...state, loading: true, error: null })),
  on(addFavoriteSuccess, (state, { favorite }) => ({
    ...state,
    loading: false,
    favorites: [...state.favorites, favorite],
    favoriteStatuses: { ...state.favoriteStatuses, [favorite.offerId]: true },
    error: null
  })),
  on(addFavoriteFailure, (state, { error }) => ({ 
    ...state, 
    loading: false, 
    error 
  })),
  on(removeFavorite, state => ({ ...state, loading: true, error: null })),
  on(removeFavoriteSuccess, (state, { offerId }) => ({
    ...state,
    loading: false,
    favorites: state.favorites.filter(fav => fav.offerId !== offerId),
    favoriteStatuses: { ...state.favoriteStatuses, [offerId]: false },
    error: null
  })),
  on(removeFavoriteFailure, (state, { error }) => ({ 
    ...state, 
    loading: false, 
    error 
  })),
  on(checkFavoriteStatus, state => ({ ...state, loading: true })),
  on(checkFavoriteStatusSuccess, (state, { offerId, isFavorite }) => ({
    ...state,
    loading: false,
    favoriteStatuses: { ...state.favoriteStatuses, [offerId]: isFavorite }
  })),
  on(checkFavoriteStatusFailure, (state, { error }) => ({ 
    ...state, 
    loading: false, 
    error 
  }))
);
