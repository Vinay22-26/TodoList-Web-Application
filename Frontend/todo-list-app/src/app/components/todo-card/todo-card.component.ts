import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Todo, TodoStatus, TodoPriority } from '../../models/todo.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatMenuModule,FormsModule],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.scss'
})
export class TodoCardComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() statusChange = new EventEmitter<{ id: string; status: TodoStatus }>();
  @Output() deleteRequest = new EventEmitter<string>();

  readonly statuses = Object.values(TodoStatus);
  readonly TodoStatus = TodoStatus;

  get isOverdue(): boolean {
    if (this.todo.status === TodoStatus.COMPLETED || !this.todo.dueDate) return false;
    const due = new Date(this.todo.dueDate);
    due.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due.getTime() < today.getTime();
  }

  get statusLabel(): string {
    return this.formatLabel(this.todo.status);
  }

  get priorityLabel(): string {
    return this.formatLabel(this.todo.priority);
  }

  get statusClass(): string {
    return `badge--status-${this.todo.status.toLowerCase()}`;
  }

  get priorityClass(): string {
    return `badge--priority-${this.todo.priority.toLowerCase()}`;
  }

  onStatusSelect(status: TodoStatus): void {
    if (status !== this.todo.status) {
      this.statusChange.emit({ id: this.todo.id, status });
    }
  }

  onMarkCompleted(): void {
    if (this.todo.status !== TodoStatus.COMPLETED) {
      this.statusChange.emit({ id: this.todo.id, status: TodoStatus.COMPLETED });
    }
  }

  onDelete(): void {
    this.deleteRequest.emit(this.todo.id);
  }

  private formatLabel(value: string): string {
    return value
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }
}
