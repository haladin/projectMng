import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HistoryEvent } from '../data/HistoryEvent';
import { Project } from '../data/Project';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { PTask } from '../data/PTask';

@Injectable({
  providedIn: 'root'
})
export class BackendServiceService {
  baseUrl = 'http://localhost:5000/api/';
  projectUrl = 'Project'
  taskUrl = 'Task'

  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}${this.projectUrl}`);
  }

  getAllTasksForAProject(projectId: string): Observable<PTask[]> {
    return this.http.get<PTask[]>(`${this.baseUrl}${this.projectUrl}/${projectId}/tasks`);
  }

  getTaskHistory(taskId: string): Observable<HistoryEvent[]> {
    return this.http.get<HistoryEvent[]>(`${this.baseUrl}${this.taskUrl}/${taskId}/history`);
  }

  updateProject(project: any): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}${this.projectUrl}`, project);
  }

  updateTask(task: any): Observable<PTask> {
    return this.http.post<PTask>(`${this.baseUrl}${this.taskUrl}`, task);
  }

  deleteProject(projectId: string) {
    return this.http.delete(`${this.baseUrl}${this.projectUrl}/${projectId}`);
  }

  deleteTask(taskId: string) {
    return this.http.delete(`${this.baseUrl}${this.taskUrl}/${taskId}`);
  }
}
