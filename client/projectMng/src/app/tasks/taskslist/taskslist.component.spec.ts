import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BackendServiceService } from 'src/app/services/backend-service.service';
import { BackendServiceServiceMock } from 'src/mocks/backend-service-mock';

import { TaskslistComponent } from './taskslist.component';

describe('TaskslistComponent', () => {
  let component: TaskslistComponent;
  let fixture: ComponentFixture<TaskslistComponent>;
  let service: BackendServiceServiceMock;

  beforeEach(async () => {
    service = new BackendServiceServiceMock();
    await TestBed.configureTestingModule({
      declarations: [TaskslistComponent],
      providers: [{ provide: BackendServiceService, useValue: service }, { provide: MatDialog, useValue: null }, { provide: FormBuilder, useValue: null }]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(TaskslistComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges();
        component.projectId = "aaa";
      });
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 tasks', () => {
    expect(component.tasks.length).toEqual(2);
  });

  it('should have 1 task with status ToDo', () => {    
    expect(component.getTaskByStatus(0).length).toEqual(1);
  });

  it('should have 1 task with status In progress', () => {    
    expect(component.getTaskByStatus(1).length).toEqual(1);
  });

  it('should have 1 task that maches the search term: task1', () => {
    component.search = "task1";
    expect(component.getTasks().length).toEqual(1);
  });
});


