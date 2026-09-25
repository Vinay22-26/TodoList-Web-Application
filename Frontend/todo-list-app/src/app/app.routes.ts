import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
    title: 'Log In | Todo App'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard],
    title: 'Sign Up | Todo App'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Dashboard | Todo App'
  },
  {
    path: 'todos',
    loadComponent: () => import('./pages/todo-list/todo-list.component').then(m => m.TodoListComponent),
    canActivate: [authGuard],
    title: 'Todos | Todo App'
  },
  {
    path: 'todos/add',
    loadComponent: () => import('./pages/todo-add/todo-add.component').then(m => m.TodoAddComponent),
    canActivate: [authGuard],
    title: 'Add Todo | Todo App'
  },
  {
    path: 'todos/:id',
    loadComponent: () => import('./pages/todo-details/todo-details.component').then(m => m.TodoDetailsComponent),
    canActivate: [authGuard],
    title: 'Todo Details | Todo App'
  },
  {
    path: 'todos/:id/edit',
    loadComponent: () => import('./pages/todo-edit/todo-edit.component').then(m => m.TodoEditComponent),
    canActivate: [authGuard],
    title: 'Edit Todo | Todo App'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Not Found | Todo App'
  }
];
