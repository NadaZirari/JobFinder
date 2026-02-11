import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { favoritesReducer } from './core/store/favorites/favorites.reducer';
import { applicationsReducer } from './core/store/applications/applications.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ 
      favorites: favoritesReducer,
      applications: applicationsReducer
    }),
    // Effects désactivés temporairement pour corriger l'erreur
    // provideEffects([FavoritesEffects, ApplicationsEffects]),
    provideStoreDevtools()
  ]
};

