import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { TaskService } from '../../services/task.service';
import { Task, TasksFilter, TaskStatus, TaskPriority } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { TaskFilterComponent } from '../task-filter/task-filter.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFilterComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  
  priorityLabels = {
    [TaskPriority.Normal]: 'Normal',
    [TaskPriority.Low]: 'Low',
    [TaskPriority.Medium]: 'Medium',
    [TaskPriority.High]: 'High',
    [TaskPriority.Top]: 'Top'
  };
  
  statusLabels = {
    [TaskStatus.Open]: 'Open',
    [TaskStatus.InProgress]: 'In Progress',
    [TaskStatus.Completed]: 'Completed'
  };

  loading = false;
  errorMessage: string | null = null;
  
  currentFilter: TasksFilter = {
    page: 1,
    pageSize: 10
  };
  
  private subscription = new Subscription();
  TaskStatus: any;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadTasks(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.subscription.add(
      this.taskService.getTasks(this.currentFilter).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = `Erro ao carregar tarefas: ${error.message}`;
          this.loading = false;
        }
      })
    );
  }

  onFilterChanged(filter: TasksFilter): void {
    this.currentFilter = filter;
    this.loadTasks();
  }

  viewTask(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  editTask(taskId: string): void {
    this.router.navigate(['/tasks', taskId, 'edit']);
  }

  createTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  deleteTask(taskId: string): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.loading = true;
      
      this.subscription.add(
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            this.loadTasks();
          },
          error: (error) => {
            this.errorMessage = `Erro ao excluir tarefa: ${error.message}`;
            this.loading = false;
          }
        })
      );
    }
  }

  getPriorityClass(priority: number): string {
    switch (priority) {
      case 3:
      case 4: 
        return 'badge bg-danger';
      case 2:
        return 'badge bg-warning text-dark';
      case 1:
        return 'badge bg-info text-dark';
      case 0:
      default:
        return 'badge bg-secondary';
    }
  }
  
  getStatusClass(status: number): string {
    switch (status) {
      case 0:
        return 'badge bg-secondary';
      case 1:
        return 'badge bg-primary';
      case 2:
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  }
  
  updateTaskStatus(task: Task, newStatus: number): void {
    if (task.status === newStatus) return;
    
    const updatedTask: Task = {
      ...task,
      status: newStatus
    };
    
    this.loading = true;
    
    this.subscription.add(
      this.taskService.updateTask(updatedTask).subscribe({
        next: () => {
          task.status = newStatus;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = `Erro ao atualizar status: ${error.message}`;
          this.loading = false;
        }
      })
    );
  }

  isOverdue(dueDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    return taskDate < today && ![TaskStatus.Completed].includes(this.tasks.find(t => t.dueDate === dueDate)?.status as TaskStatus);
  }
}