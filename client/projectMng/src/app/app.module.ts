import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectsComponent, ProjectEditDialog, ProjectDeleteDialog } from './projects/projects.component';
import { TaskslistComponent, TaskDetailsDialog, TaskHistoryDialog, DeleteTaskDialog } from './tasks/taskslist/taskslist.component';
import { TaskOverviewComponent } from './tasks/task-overview/task-overview.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    TaskslistComponent,
    TaskDetailsDialog,
    TaskOverviewComponent,
    TaskHistoryDialog,
    ProjectEditDialog,
    DeleteTaskDialog,
    ProjectDeleteDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
