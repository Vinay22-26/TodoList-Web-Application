import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TodoCardComponent } from '../../components/todo-card/todo-card.component';
import { TodoFiltersComponent, TodoFilterState } from '../../components/todo-filters/todo-filters.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { LoadingIndicatorComponent } from '../../components/loading-indicator/loading-indicator.component';
import { DeleteConfirmDialogComponent } from '../../components/delete-confirm-dialog/delete-confirm-dialog.component';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoStatus, TodoPriority } from '../../models/todo.model';

const PRIORITY_WEIGHT: Record<TodoPriority, number> = {
  [TodoPriority.HIGH]: 0,
  [TodoPriority.MEDIUM]: 1,
  [TodoPriority.LOW]: 2
};

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatDialogModule,
    TodoCardComponent,
    TodoFiltersComponent,
    EmptyStateComponent,
    LoadingIndicatorComponent
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit {
  allTodos: Todo[] = [];
  visibleTodos: Todo[] = [];
  loading = true;
  error = '';

  private filters: TodoFilterState = {
    search: '',
    status: 'ALL',
    priority: 'ALL',
    sortBy: 'dueDate'
  };

  constructor(private todoService: TodoService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.todoService.getTodos().subscribe({
      next: todos => {
        this.allTodos = todos;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load todos. Please try again.';
        this.loading = false;
      }
    });
  }

  onFiltersChange(filters: TodoFilterState): void {
    this.filters = filters;
    this.applyFilters();
  }

  onStatusChange(event: { id: string; status: TodoStatus }): void {
    this.todoService.updateStatus(event.id, event.status).subscribe({
      next: () => this.load(),
      error: () => (this.error = 'Unable to update status.')
    });
  }

  onDeleteRequest(id: string): void {
    const todo = this.allTodos.find(t => t.id === id);
    if (!todo) return;

    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      data: { title: todo.title }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.todoService.deleteTodo(id).subscribe({
          next: () => this.load(),
          error: () => (this.error = 'Unable to delete todo.')
        });
      }
    });
  }

  private applyFilters(): void {
    let result = [...this.allTodos];
    const search = this.filters.search.trim().toLowerCase();

    if (search) {
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search)
      );
    }

    if (this.filters.status !== 'ALL') {
      result = result.filter(t => t.status === this.filters.status);
    }

    if (this.filters.priority !== 'ALL') {
      result = result.filter(t => t.priority === this.filters.priority);
    }

    result.sort((a, b) => {
      switch (this.filters.sortBy) {
        case 'priority':
          return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dueDate':
        default:
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });

    this.visibleTodos = result;
  }
}
