import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DashboardStatsComponent } from '../../components/dashboard-stats/dashboard-stats.component';
import { TodoCardComponent } from '../../components/todo-card/todo-card.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { LoadingIndicatorComponent } from '../../components/loading-indicator/loading-indicator.component';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoStats, TodoStatus } from '../../models/todo.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    DashboardStatsComponent,
    TodoCardComponent,
    EmptyStateComponent,
    LoadingIndicatorComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: TodoStats | null = null;
  recentTodos: Todo[] = [];
  todaysTodos: Todo[] = [];
  loading = true;
  error = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.todoService.getStats().subscribe({
      next: stats => (this.stats = stats),
      error: () => (this.error = 'Unable to load dashboard statistics.')
    });

    this.todoService.getTodos().subscribe({
      next: todos => {
        this.recentTodos = [...todos]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);

        const todayStr = new Date().toISOString().split('T')[0];
        this.todaysTodos = todos.filter(t => t.dueDate === todayStr);
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load todos. Please try again.';
        this.loading = false;
      }
    });
  }

  onStatusChange(event: { id: string; status: TodoStatus }): void {
    this.todoService.updateStatus(event.id, event.status).subscribe({
      next: () => this.load(),
      error: () => (this.error = 'Unable to update status.')
    });
  }

  onDeleteRequest(id: string): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => this.load(),
      error: () => (this.error = 'Unable to delete todo.')
    });
  }
}
