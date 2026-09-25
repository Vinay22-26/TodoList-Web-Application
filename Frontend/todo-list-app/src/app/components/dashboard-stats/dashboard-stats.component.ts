import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TodoStats } from '../../models/todo.model';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  accent: string;
}

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.scss'
})
export class DashboardStatsComponent {
  @Input() set stats(value: TodoStats | null) {
    if (!value) {
      this.cards = [];
      return;
    }
    this.cards = [
      { label: 'Total Todos', value: value.total, icon: 'list_alt', accent: 'accent--purple' },
      { label: 'Pending', value: value.pending, icon: 'schedule', accent: 'accent--amber' },
      { label: 'In Progress', value: value.inProgress, icon: 'autorenew', accent: 'accent--blue' },
      { label: 'Completed', value: value.completed, icon: 'task_alt', accent: 'accent--green' },
      { label: 'Overdue', value: value.overdue, icon: 'warning', accent: 'accent--red' }
    ];
  }

  cards: StatCard[] = [];
}
