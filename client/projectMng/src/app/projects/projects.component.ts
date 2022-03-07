import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Project } from '../data/Project';
import { BackendServiceService } from '../services/backend-service.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];
  currentProject = "Select a project";
  currentProjectId = "";
  avatar = "";
  haveAvatar = false;

  constructor(public dialog: MatDialog, private backendService: BackendServiceService) {

  }

  ngOnInit(): void {
    this.backendService.getAllProjects().subscribe({
      next: response => {
        this.projects = response;
      },
      error: error => {
        console.log(error);
      }
    })
  }

  onProjectClick(id: number): void {
    this.currentProject = this.projects[id].name;
    this.currentProjectId = this.projects[id].id;

    if (this.projects[id].avatar && this.projects[id].avatar !== "") {
      this.avatar = this.projects[id].avatar;
      this.haveAvatar = true;
    } else {
      this.avatar = "";
      this.haveAvatar = false;
    }
  }

  onEditClick(id: number): void {
    this.openEditDialog(this.projects[id].id);
  }

  onDeleteClick(id: number): void {
    this.currentProject = this.projects[id].name;
    this.currentProjectId = this.projects[id].id;
  }

  openDeleteProjectDialog(event: any) {

    const index = event as unknown as number;

    let data = { ...this.projects[index] }

    let dialogRef = this.dialog.open(ProjectDeleteDialog, {
      width: '600px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch (result.event) {
          case "delete":
            this.backendService.deleteProject(data.id).subscribe({
              next: response => {
                if (index > -1) {
                  this.projects = this.projects.filter(p => p.id != data.id);
                  this.currentProject = "Select a project";
                  this.currentProjectId = "";
                  this.avatar = "";
                  this.haveAvatar = false;
                }
              }, error: error => {
                console.log(error);
              }
            });

            break;
          default:
            break;
        }
      }
    });
  }

  openEditDialog(event: any) {
    let projectId = event as unknown as string;
    const index = this.projects.findIndex(e => e.id == projectId);

    let data;
    if (index > -1) {

      data = {
        ...this.projects[index]
      };

    }
    else {
      data = {
        name: "",
        avatar: ""
      };
    }
    let dialogRef = this.dialog.open(ProjectEditDialog, {
      width: '600px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        switch (result.event) {
          case "save":
            this.backendService.updateProject(result.data).subscribe({
              next: response => {

                const project = response;
                const index = this.projects.findIndex(e => e.id == project.id);

                if (index > -1) {
                  this.projects[index] = project;
                } else {
                  this.projects.push(project);

                }
                this.currentProject = project.name;
                this.currentProjectId = project.id;
                if (project.avatar && project.avatar !== "") {
                  this.avatar = project.avatar;
                  this.haveAvatar = true;
                } else {
                  this.avatar = "";
                  this.haveAvatar = false;
                }
              }, error: error => {
                console.log(error);
              }
            });

            break;
          default:
            break;
        }
      }
    });
  }
}

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-edit-dialog.html',
  styleUrls: ['./project-edit-dialog.css']
})
export class ProjectEditDialog implements OnInit {

  form: any;
  title = "New project"
  imageError: any;
  base64textString: string = "data:image/png;base64,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";

  constructor(public dialogRef: MatDialogRef<ProjectEditDialog>, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Project) {
    if (data?.name !== "") {
      this.title = "Edit project"
    }

    if (data?.avatar && data?.avatar !== "") {
      this.base64textString = data?.avatar;
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      avatar: ['']
    });
  }

  save() {
    this.dialogRef.close({ event: 'save', data: this.data });
  }

  handleFileSelect(fileInput: any): void {

    const max_size = 100000;
    const allowed_types = ['image/png', 'image/jpeg'];
    const max_height = 151;
    const max_width = 151;
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      if (fileInput.target.files[0].size > max_size) {
        this.imageError =
          'Maximum size allowed is ' + max_size / (1000) + 'Kb';
        return;
      }

      if (!allowed_types.includes(fileInput.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        return;
      }
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = (rs: any) => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
          } else {
            const imgBase64Path = e.target.result;
            this.base64textString = imgBase64Path;
            this.data.avatar = this.base64textString;
            this.form.markAsTouched();
          }
        };
      }
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }
}

@Component({
  selector: 'app-task-delete-dialog',
  templateUrl: 'project-delete-dialog.html',
  styleUrls: ['./project-delete-dialog.css']
})
export class ProjectDeleteDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<ProjectDeleteDialog>, @Inject(MAT_DIALOG_DATA) public data: Project) { }
  ngOnInit(): void {
    console.log(this.data);
  }

  onDelete() {
    this.dialogRef.close({ event: 'delete', data: this.data });
  }
}