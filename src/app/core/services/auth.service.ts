import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { User, UserSession } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000';
  private readonly USER_KEY = 'jobfinder_user';
  
  private currentUserSubject = new BehaviorSubject<UserSession | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem(this.USER_KEY);
      }
    }
  }

  login(email: string, password: string): Observable<UserSession> {
    return this.http.get<User[]>(`${this.API_URL}/users`).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
          throw new Error('Email ou mot de passe incorrect');
        }
        
        const userSession: UserSession = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        };
        
        this.saveUserToStorage(userSession);
        return userSession;
      }),
      tap(user => this.currentUserSubject.next(user)),
      catchError(error => throwError(() => error.message || 'Erreur de connexion'))
    );
  }

  register(userData: Omit<User, 'id'>): Observable<UserSession> {
    return this.http.get<User[]>(`${this.API_URL}/users`).pipe(
      switchMap(users => {
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
          throw new Error('Cet email est déjà utilisé');
        }
        
        const newUser: User = {
          ...userData,
          id: (users.length + 1).toString()
        };
        
        return this.http.post<User>(`${this.API_URL}/users`, newUser);
      }),
      map(createdUser => {
        const userSession: UserSession = {
          id: createdUser.id,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          email: createdUser.email
        };
        
        this.saveUserToStorage(userSession);
        return userSession;
      }),
      tap(user => this.currentUserSubject.next(user)),
      catchError(error => throwError(() => error.message || 'Erreur lors de l\'inscription'))
    );
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): UserSession | null {
    return this.currentUserSubject.value;
  }

  updateUser(userData: Partial<UserSession>): Observable<UserSession> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => 'Utilisateur non connecté');
    }

    return this.http.patch<User>(`${this.API_URL}/users/${currentUser.id}`, userData).pipe(
      map(updatedUser => {
        const userSession: UserSession = {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email
        };
        
        this.saveUserToStorage(userSession);
        return userSession;
      }),
      tap(user => this.currentUserSubject.next(user)),
      catchError(error => throwError(() => error.message || 'Erreur lors de la mise à jour'))
    );
  }

  deleteAccount(): Observable<void> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => 'Utilisateur non connecté');
    }

    return this.http.delete<void>(`${this.API_URL}/users/${currentUser.id}`).pipe(
      tap(() => {
        this.logout();
      }),
      catchError(error => throwError(() => error.message || 'Erreur lors de la suppression'))
    );
  }

  private saveUserToStorage(user: UserSession): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
