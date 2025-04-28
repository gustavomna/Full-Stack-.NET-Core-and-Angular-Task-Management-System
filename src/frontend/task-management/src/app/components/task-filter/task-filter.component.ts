import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { TaskStatus, TaskPriority, TasksFilter } from '../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.scss']
})
export class TaskFilterComponent implements OnInit, OnDestroy {
  @Output() filterChanged = new EventEmitter<TasksFilter>();
  
  filterForm: FormGroup;
  private subscription = new Subscription();
  
  taskStatuses = Object.values(TaskStatus);
  taskPriorities = Object.values(TaskPriority);
  
  defaultPage = 1;
  defaultPageSize = 10;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      status: [''],
      priority: [''],
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    const formChanges = this.filterForm.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged((prev, curr) => {
        return JSON.stringify(prev) === JSON.stringify(curr);
      })
    );
    
    this.subscription.add(
      formChanges.subscribe(formValue => {
        this.applyFilter();
      })
    );
    
    this.applyFilter();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  applyFilter(): void {
    const formValue = this.filterForm.value;
    
    const filter: TasksFilter = {
      page: this.defaultPage,
      pageSize: this.defaultPageSize
    };
    
    if (formValue.status !== null && formValue.status !== '') {
      filter.status = Number(formValue.status);
    }
    
    if (formValue.priority !== null && formValue.priority !== '') {
      filter.priority = Number(formValue.priority);
    }
    
    if (formValue.searchTerm && formValue.searchTerm.trim()) {
      filter.searchTerm = formValue.searchTerm.trim();
    }
    
    this.filterChanged.emit(filter);
  }

  clearFilters(): void {
    this.filterForm.reset({
      status: '',
      priority: '',
      searchTerm: ''
    });
    
  }
}