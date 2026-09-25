import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { LoadingIndicatorComponent } from '../../components/loading-indicator/loading-indicator.component';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoCreateRequest } from '../../models/todo.model';

@Component({
  selector: 'app-todo-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, TodoFormComponent, LoadingIndicatorComponent],
  templateUrl: './todo-edit.component.html',
  styleUrl: './todo-edit.component.scss'
})
export class TodoEditComponent implements OnInit {
  todo: Todo | null = null;
  loading = true;
  submitting = false;
  error = '';
   todoId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService
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

  onSubmit(request: TodoCreateRequest): void {
    this.submitting = true;
    this.error = '';
    this.todoService.updateTodo(this.todoId, request).subscribe({
      next: todo => this.router.navigate(['/todos', todo.id]),
      error: () => {
        this.error = 'Unable to save changes. Please try again.';
        this.submitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/todos', this.todoId]);
  }
}
