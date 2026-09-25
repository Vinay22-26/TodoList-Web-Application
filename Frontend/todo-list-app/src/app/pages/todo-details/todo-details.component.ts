import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoadingIndicatorComponent } from '../../components/loading-indicator/loading-indicator.component';
import { DeleteConfirmDialogComponent } from '../../components/delete-confirm-dialog/delete-confirm-dialog.component';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoStatus } from '../../models/todo.model';

@Component({
  selector: 'app-todo-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatDialogModule, LoadingIndicatorComponent],
  templateUrl: './todo-details.component.html',
  styleUrl: './todo-details.component.scss'
})
export class TodoDetailsComponent implements OnInit {
  todo: Todo | null = null;
  loading = true;
  error = '';
  todoId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.todoId = this.route.snapshot.paramMap.get('id') || '';
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.todoService.getTodoById(this.todoId).subscribe({
      next: todo => {
        this.todo = todo;
        this.loading = false;
      },
      error: () => {
        this.error = 'This todo could not be found.';
        this.loading = false;
      }
    });
  }

  get isOverdue(): boolean {
    if (!this.todo || this.todo.status === TodoStatus.COMPLETED || !this.todo.dueDate) return false;
    const due = new Date(this.todo.dueDate);
    due.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due.getTime() < today.getTime();
  }

  formatLabel(value: string): string {
    return value
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  onDelete(): void {
    if (!this.todo) return;
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      data: { title: this.todo.title }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.todoService.deleteTodo(this.todoId).subscribe({
          next: () => this.router.navigate(['/todos']),
          error: () => (this.error = 'Unable to delete this todo.')
        });
      }
    });
  }
}
