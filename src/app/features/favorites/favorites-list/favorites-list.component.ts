import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Favorite } from '../../../core/models/favorite.model';
import * as FavoritesActions from '../../../core/store/favorites/favorites.actions';
import { selectFavorites, selectFavoritesLoading, selectFavoritesError } from '../../../core/store/favorites/favorites.selectors';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.css']
})
export class FavoritesListComponent implements OnInit {
  favorites$: Observable<Favorite[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.favorites$ = this.store.select(selectFavorites);
    this.loading$ = this.store.select(selectFavoritesLoading);
    this.error$ = this.store.select(selectFavoritesError);
  }

  ngOnInit(): void {
    this.store.dispatch(FavoritesActions.loadFavorites());
  }

  removeFromFavorites(offerId: string): void {
    this.store.dispatch(FavoritesActions.removeFavorite({ offerId }));
  }

  viewJob(offerId: string): void {
    // Pour l'instant, nous n'avons pas l'URL complète dans les favoris
    // TODO: Stocker l'URL complète dans les favoris ou la récupérer
    console.log('Voir l\'offre:', offerId);
  }
}
