import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackendServiceService } from '../services/backend-service.service';

import { ProjectsComponent } from './projects.component';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../data/Project';
import { PTask } from '../data/PTask';
import { Observable, of } from 'rxjs';
import { BackendServiceServiceMock } from 'src/mocks/backend-service-mock';


describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let service: BackendServiceServiceMock;

  beforeEach(async () => {
    service = new BackendServiceServiceMock();
    TestBed.configureTestingModule({
      declarations: [ProjectsComponent],
      providers: [{ provide: BackendServiceService, useValue: service }, { provide: MatDialog, useValue: null }]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(ProjectsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 3 projects', () => {
    component.ngOnInit();
    expect(component.projects.length).toEqual(3);
  });


});
