import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Todo, TodoCreateRequest, TodoUpdateRequest, TodoStatus, TodoStats } from '../models/todo.model';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TodoService {

  private readonly baseUrl = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl).pipe(catchError(this.handleError));
  }

  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  addTodo(request: TodoCreateRequest): Observable<Todo> {
    return this.http.post<Todo>(this.baseUrl, request).pipe(catchError(this.handleError));
  }

  updateTodo(id: string, request: TodoUpdateRequest): Observable<Todo> {
    return this.http.put<Todo>(`${this.baseUrl}/${id}`, request).pipe(catchError(this.handleError));
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  updateStatus(id: string, status: TodoStatus): Observable<Todo> {
    return this.updateTodo(id, { status });
  }

  getStats(): Observable<TodoStats> {
    return this.getTodos().pipe(
      map(todos => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const stats: TodoStats = {
          total: todos.length,
          pending: todos.filter(t => t.status === TodoStatus.PENDING).length,
          inProgress: todos.filter(t => t.status === TodoStatus.IN_PROGRESS).length,
          completed: todos.filter(t => t.status === TodoStatus.COMPLETED).length,
          overdue: todos.filter(t => {
            if (t.status === TodoStatus.COMPLETED || !t.dueDate) return false;
            const due = new Date(t.dueDate);
            due.setHours(0, 0, 0, 0);
            return due.getTime() < now.getTime();
          }).length
        };
        return stats;
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.status === 0) {
      message = 'Unable to reach the server. Please check your connection.';
    } else if (error.status === 404) {
      message = 'The requested todo could not be found.';
    } else if (error.error?.message) {
      message = error.error.message;
    }
    return throwError(() => new Error(message));
  }
}
