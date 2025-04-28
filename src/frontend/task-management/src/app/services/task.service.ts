import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { 
  Task, 
  TasksFilter, 
  PaginatedResult, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskResponse 
} from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/Tasks`;

  constructor(private http: HttpClient) { }

  getTasks(filter?: TasksFilter): Observable<Task[]> {
    if (!environment.apiUrl) {
      console.error('API URL is not configured in environment');
      return of([]);
    }

    return this.http.get<TaskResponse[]>(this.apiUrl).pipe(
      map(tasks => {
        const taskList = tasks || [];

        if (!filter) return this.mapTaskResponsesToTasks(taskList);
        
        let filteredTasks = tasks;
        
        if (filter.status) {
          filteredTasks = filteredTasks.filter(task => task.status === filter.status);
        }
        
        if (filter.priority) {
          filteredTasks = filteredTasks.filter(task => task.priority === filter.priority);
        }
        
        if (filter.searchTerm) {
          const searchTerm = filter.searchTerm.toLowerCase();
          filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) || 
            task.description.toLowerCase().includes(searchTerm)
          );
        }
        
        const startIndex = (filter.page - 1) * filter.pageSize;
        const paginatedTasks = filteredTasks.slice(startIndex, startIndex + filter.pageSize);
        
        return this.mapTaskResponsesToTasks(paginatedTasks);
      }),
      catchError(error => {
        console.error('Error fetching tasks', error);
        return of([]);
      })
    );
  }

  getTaskById(id: string): Observable<Task> {
    console.log('Enviando requisição para:', `${this.apiUrl}/${id}`);
    
    return this.http.get<TaskResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        console.log('Resposta recebida:', response);
        return this.mapTaskResponseToTask(response);
      }),
      catchError(error => {
        console.error(`Erro no serviço ao buscar tarefa com id ${id}`, error);
        throw error;
      })
    );
  }

  createTask(task: Omit<Task, 'id'>): Observable<string> {
    const request: CreateTaskRequest = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority
    };
    
    return this.http.post<string>(this.apiUrl, request);
  }

  updateTask(task: Task): Observable<void> {
    const request: UpdateTaskRequest = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status
    };
    
    return this.http.put<void>(`${this.apiUrl}/${task.id}`, request);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapTaskResponseToTask(response: TaskResponse): Task {
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      dueDate: new Date(response.dueDate),
      priority: response.priority,
      status: response.status
    };
  }

  private mapTaskResponsesToTasks(responses: TaskResponse[]): Task[] {
    return responses.map(response => this.mapTaskResponseToTask(response));
  }
}