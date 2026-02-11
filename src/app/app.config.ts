import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { favoritesReducer } from './core/store/favorites/favorites.reducer';
import { FavoritesEffects } from './core/store/favorites/favorites.effects';
import { applicationsReducer } from './core/store/applications/applications.reducer';
import { ApplicationsEffects } from './core/store/applications/applications.effects';
import { errorInterceptor } from './core/interceptors/error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideStore({ 
      favorites: favoritesReducer,
      applications: applicationsReducer
    }),
    provideEffects([FavoritesEffects, ApplicationsEffects]),
    provideStoreDevtools()
  ]
};

