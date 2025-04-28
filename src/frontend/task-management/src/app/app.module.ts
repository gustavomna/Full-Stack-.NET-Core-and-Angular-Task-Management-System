// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { RouterModule, Routes } from '@angular/router';

// import { AppComponent } from './app.component';
// import { TaskListComponent } from './components/task-list/task-list.component';
// import { TaskFormComponent } from './components/task-form/task-form.component';
// import { TaskDetailComponent } from './components/task-detail/task-detail.component';
// import { TaskFilterComponent } from './components/task-filter/task-filter.component';
// import { CommonModule } from '@angular/common';
// import { AuthInterceptor } from './interceptors/auth.interceptor';

// const routes: Routes = [
//   { path: '', redirectTo: 'tasks', pathMatch: 'full' },
//   { path: 'tasks', component: TaskListComponent },
//   { path: 'tasks/new', component: TaskFormComponent },
//   { path: 'tasks/:id', component: TaskDetailComponent },
//   { path: 'tasks/:id/edit', component: TaskFormComponent }
// ];

// @NgModule({
//   declarations: [
//     AppComponent,
//     TaskListComponent,
//     TaskFormComponent,
//     TaskDetailComponent,
//     TaskFilterComponent
//   ],
//   imports: [
//     CommonModule,
//     BrowserModule,
//     FormsModule,
//     ReactiveFormsModule,
//     HttpClientModule,
//     RouterModule.forRoot(routes)
//   ],
//   providers: [
//     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
//   ],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }