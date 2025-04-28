import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { switchMap, catchError, finalize } from 'rxjs/operators';

import { TaskService } from '../../services/task.service';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  task: Task | null = null;
  loading = false;
  errorMessage: string | null = null;
  
  private subscription = new Subscription();
  
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.loadTask();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadTask(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.subscription.add(
      this.route.paramMap.pipe(
        switchMap(params => {
          const taskId = params.get('id');
          
          if (!taskId) {
            throw new Error('ID da tarefa não encontrado');
          }
          
          console.log('Buscando tarefa com ID:', taskId);
          return this.taskService.getTaskById(taskId);
        }),
        catchError(error => {
          console.error('Erro no switchMap:', error); 
          this.errorMessage = `Erro ao carregar tarefa: ${error.message}`;
          this.loading = false;
          return of(null);
        })
      ).subscribe({
        next: (task) => {
          console.log('Tarefa recebida:', task);
          this.task = task;
          this.loading = false; 
        },
        error: (error) => {
          console.error('Erro na inscrição:', error);
          this.errorMessage = `Erro ao carregar tarefa: ${error.message}`;
          this.loading = false;
        },
        complete: () => {
          console.log('Carregamento completo');
          this.loading = false;
        }
      })
    );
  }
  editTask(): void {
    if (this.task) {
      this.router.navigate(['/tasks', this.task.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  deleteTask(): void {
    if (!this.task) return;
    
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.loading = true;
      
      this.subscription.add(
        this.taskService.deleteTask(this.task.id).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            this.errorMessage = `Erro ao excluir tarefa: ${error.message}`;
            this.loading = false;
          }
        })
      );
    }
  }

  updateTaskStatus(newStatus: TaskStatus): void {
    if (!this.task || this.task.status === newStatus) return;
    
    const updatedTask: Task = {
      ...this.task,
      status: newStatus
    };
    
    this.loading = true;
    
    this.subscription.add(
      this.taskService.updateTask(updatedTask).subscribe({
        next: () => {
          if (this.task) {
            this.task.status = newStatus;
          }
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = `Erro ao atualizar status: ${error.message}`;
          this.loading = false;
        }
      })
    );
  }

  getPriorityClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.High:
        return 'badge bg-danger';
      case TaskPriority.Medium:
        return 'badge bg-warning text-dark';
      case TaskPriority.Low:
        return 'badge bg-info text-dark';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Open:
        return 'badge bg-secondary';
      case TaskStatus.InProgress:
        return 'badge bg-primary';
      case TaskStatus.Completed:
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  }

  isOverdue(dueDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    return taskDate < today && (this.task?.status !== TaskStatus.Completed);
  }
}