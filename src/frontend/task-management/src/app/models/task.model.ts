  export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    status: TaskStatus;
  }
  
  export interface TasksFilter {
    status?: TaskStatus;
    priority?: TaskPriority;
    page: number;
    pageSize: number;
    searchTerm?: string;
  }
  
  export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  }
  
  export interface CreateTaskRequest {
    title: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
  }
  
  export interface UpdateTaskRequest {
    title: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    status: TaskStatus;
  }
  
  export interface TaskResponse {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    status: TaskStatus;
  }

  export enum TaskPriority {
    Normal = 0,
    Low = 1,
    Medium = 2,
    High = 3,
    Top = 4
  }
  
  export enum TaskStatus {
    Open = 0,
    InProgress = 1,
    Completed = 2
  }