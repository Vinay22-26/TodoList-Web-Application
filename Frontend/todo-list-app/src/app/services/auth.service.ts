import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthSession, LoginRequest, RegisterRequest, User } from '../models/user.model';

const SESSION_KEY = 'todo_app_session_v1';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private currentSessionSubject: BehaviorSubject<AuthSession | null>;

  constructor(private http: HttpClient) {
    this.currentSessionSubject = new BehaviorSubject<AuthSession | null>(this.readSession());
  }

  get currentSession$(): Observable<AuthSession | null> {
    return this.currentSessionSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.currentSessionSubject.value?.user ?? null;
  }

  get token(): string | null {
    return this.currentSessionSubject.value?.token ?? null;
  }

  isAuthenticated(): boolean {
    return this.currentSessionSubject.value !== null;
  }

  register(request: RegisterRequest): Observable<AuthSession> {
    return this.http.post<AuthSession>(`${this.baseUrl}/register`, request).pipe(
      tap(session => this.persistSession(session)),
      catchError(this.handleError)
    );
  }

  login(request: LoginRequest): Observable<AuthSession> {
    return this.http.post<AuthSession>(`${this.baseUrl}/login`, request).pipe(
      tap(session => this.persistSession(session)),
      catchError(this.handleError)
    );
  }

  logout(): void {
    const token = this.token;
    this.clearSession();

    if (token) {
      this.http
        .post<void>(`${this.baseUrl}/logout`, {}, { headers: { Authorization: `Bearer ${token}` } })
        .pipe(catchError(() => of(void 0)))
        .subscribe();
    }
  }

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    this.currentSessionSubject.next(null);
  }

  private persistSession(session: AuthSession): void {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Session still works in-memory for this tab even if storage fails.
    }
    this.currentSessionSubject.next(session);
  }

  private readSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  }

  private handleError = (error: HttpErrorResponse) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.status === 0) {
      message = 'Unable to reach the server. Please check your connection.';
    } else if (error.error?.message) {
      message = error.error.message;
    }
    return throwError(() => new Error(message));
  };
}
