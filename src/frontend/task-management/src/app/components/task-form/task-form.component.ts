import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError, finalize } from 'rxjs/operators';

import { TaskService } from '../../services/task.service';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId: string | null = null;
  loading = false;
  submitted = false;
  errorMessage: string | null = null;
  
  taskPriorities = Object.values(TaskPriority);
  taskStatuses = Object.values(TaskStatus);
  
  minDate: string;
  
  get f() { return this.taskForm.controls; }

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      dueDate: ['', [Validators.required]],
      priority: [TaskPriority.Normal, [Validators.required]],
      status: [{ value: TaskStatus.Open, disabled: !this.isEditMode }]
    });
    
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.taskId = params.get('id');
        
        if (this.taskId) {
          this.isEditMode = true;
          
          this.taskForm.get('status')?.enable();
          
          return this.taskService.getTaskById(this.taskId);
        }
        
        return of(null);
      }),
      tap(task => {
        if (task) {
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            dueDate: new Date(task.dueDate).toISOString().split('T')[0],
            priority: task.priority,
            status: task.status
          });
        }
      }),
      catchError(error => {
        this.errorMessage = `Erro ao carregar tarefa: ${error.message}`;
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe();
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.taskForm.invalid) {
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.loading = true;
    
    const formData = this.taskForm.value;
    const task: Partial<Task> = {
      title: formData.title,
      description: formData.description,
      dueDate: new Date(formData.dueDate),
      priority: Number(formData.priority),
      status: this.isEditMode ? Number(formData.status) : TaskStatus.Open
    };
    
    const action$: Observable<any> = this.isEditMode
      ? this.taskService.updateTask({ ...task, id: this.taskId! } as Task)
      : this.taskService.createTask(task as Omit<Task, 'id'>);
    
    action$.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        this.errorMessage = `Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} tarefa: ${error.message}`;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  
  resetForm(): void {
    this.submitted = false;
    this.errorMessage = null;
    
    if (this.isEditMode) {
      this.ngOnInit();
    } else {
      this.taskForm.reset({
        title: '',
        description: '',
        dueDate: '',
        priority: TaskPriority.Medium,
        status: TaskStatus.Open
      });
    }
  }
  
  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}