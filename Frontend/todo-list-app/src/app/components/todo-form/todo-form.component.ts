import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Todo, TodoCreateRequest, TodoPriority, TodoStatus } from '../../models/todo.model';

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 1000;

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent implements OnChanges {
  @Input() initialValue: Todo | null = null;
  @Input() submitting = false;
  @Input() submitLabel = 'Save Todo';
  @Output() formSubmit = new EventEmitter<TodoCreateRequest>();
  @Output() cancelled = new EventEmitter<void>();

  readonly priorities = Object.values(TodoPriority);
  readonly statuses = Object.values(TodoStatus);
  readonly titleMaxLength = TITLE_MAX_LENGTH;
  readonly descriptionMaxLength = DESCRIPTION_MAX_LENGTH;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(TITLE_MAX_LENGTH)]],
      description: ['', [Validators.maxLength(DESCRIPTION_MAX_LENGTH)]],
      dueDate: ['', [Validators.required]],
      priority: [TodoPriority.MEDIUM, [Validators.required]],
      status: [TodoStatus.PENDING, [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] && this.initialValue) {
      this.form.patchValue({
        title: this.initialValue.title,
        description: this.initialValue.description,
        dueDate: this.initialValue.dueDate,
        priority: this.initialValue.priority,
        status: this.initialValue.status
      });
    }
  }

  get title() { return this.form.get('title'); }
  get description() { return this.form.get('description'); }
  get dueDate() { return this.form.get('dueDate'); }
  get priority() { return this.form.get('priority'); }
  get status() { return this.form.get('status'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.form.value as TodoCreateRequest);
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  formatLabel(value: string): string {
    return value
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }
}
