import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TodoPriority, TodoStatus } from '../../models/todo.model';

export interface TodoFilterState {
  search: string;
  status: TodoStatus | 'ALL';
  priority: TodoPriority | 'ALL';
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
}

@Component({
  selector: 'app-todo-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './todo-filters.component.html',
  styleUrl: './todo-filters.component.scss'
})
export class TodoFiltersComponent {
  @Output() filtersChange = new EventEmitter<TodoFilterState>();

  readonly statuses = Object.values(TodoStatus);
  readonly priorities = Object.values(TodoPriority);

  state: TodoFilterState = {
    search: '',
    status: 'ALL',
    priority: 'ALL',
    sortBy: 'dueDate'
  };

  emit(): void {
    this.filtersChange.emit({ ...this.state });
  }

  formatLabel(value: string): string {
    return value
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  clearSearch(): void {
    this.state.search = '';
    this.emit();
  }
}
