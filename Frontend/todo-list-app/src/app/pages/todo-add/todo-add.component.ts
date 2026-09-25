import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { TodoService } from '../../services/todo.service';
import { TodoCreateRequest } from '../../models/todo.model';

@Component({
  selector: 'app-todo-add',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, TodoFormComponent],
  templateUrl: './todo-add.component.html',
  styleUrl: './todo-add.component.scss'
})
export class TodoAddComponent {
  submitting = false;
  error = '';

  constructor(private todoService: TodoService, private router: Router) {}

  onSubmit(request: TodoCreateRequest): void {
    this.submitting = true;
    this.error = '';
    this.todoService.addTodo(request).subscribe({
      next: todo => this.router.navigate(['/todos', todo.id]),
      error: () => {
        this.error = 'Unable to create this todo. Please try again.';
        this.submitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/todos']);
  }
}
