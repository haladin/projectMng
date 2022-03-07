import { Component, Input, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HistoryEvent } from 'src/app/data/HistoryEvent';
import { PTask } from 'src/app/data/PTask';
import { BackendServiceService } from 'src/app/services/backend-service.service';

@Component({
  selector: 'app-taskslist',
  templateUrl: './taskslist.component.html',
  styleUrls: ['./taskslist.component.css']
})
export class TaskslistComponent implements OnInit {
  tasks: PTask[] = [];
  groupByStatus = false;
  form: any;
  search = "";
  searching = false;

  @Input()
  get projectId(): string { return this._projectId; }
  set projectId(projectId: string) {
    this._projectId = projectId;
    this.search = "";
    this.searching = false;
    this.tasks = [];
    if (projectId !== "") {
      this.loadTasks(projectId);
    }
  }
  private _projectId = '';

  constructor(public dialog: MatDialog, private backendService: BackendServiceService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      search: ['']
    });
  }

  onChangeSearch(event: any) {
    let searchString = event as unknown as string;
    if (searchString && searchString.length > 0) {
      this.searching = true;
    } else {
      this.searching = false;
    }
  }

  onClickClear() {
    this.searching = false;
    this.search = "";
  }

  loadTasks(id: string): void {
    this.backendService.getAllTasksForAProject(id).subscribe({
      next: (response) => {
        this.tasks = response;
      }, error: error => {
        console.log(error);
      }
    })
  }

  switchVew() {
    this.groupByStatus = !this.groupByStatus;
  }

  getTaskByStatus(status: number) {
    return this.getTasks().filter(t => t.status === status);
  }

  getTasks() {
    return this.tasks.filter(t => t.title.toLowerCase().includes(this.search.toLowerCase()));
  }

  openEditDialog(event: any) {
    let taskId = event as unknown as string;
    // let taskId = -1;
    const index = this.tasks.findIndex(e => e.id == taskId);

    let data;
    if (index > -1) {

      data = {
        ...this.tasks[index]
      };

    }
    else {
      data = {
        assignee: "",
        description: "",
        estimate: 0,
        priority: 0,
        projectId: this._projectId,
        status: 0,
        title: "",
        type: 0
      };
    }

    let dialogRef = this.dialog.open(TaskDetailsDialog, {
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        switch (result.event) {
          case "save":
            this.backendService.updateTask(result.data).subscribe({
              next: response => {

                const task = response;
                const index = this.tasks.findIndex(e => e.id == task.id);

                if (index > -1) {
                  this.tasks[index] = task;
                } else {
                  this.tasks.push(task);
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

  openHistoryDialog(event: any) {
    let taskId = event as unknown as string;

    this.backendService.getTaskHistory(taskId).subscribe({
      next: response => {
        let data = response.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1);
        let dialogRef = this.dialog.open(TaskHistoryDialog, {
          width: '600px',
          data
        });
      }, error: error => {
        console.log(error);
      }
    });
  }

  openDeleteTaskDialog(event: any) {
    let taskId = event as unknown as string;
    const index = this.tasks.findIndex(e => e.id == taskId);

    let data = { ...this.tasks[index] }

    let dialogRef = this.dialog.open(DeleteTaskDialog, {
      width: '600px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch (result.event) {
          case "delete":
            this.backendService.deleteTask(taskId).subscribe({
              next: response => {
                if (index > -1) {
                  this.tasks = this.tasks.filter(t => t.id != taskId);
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
  selector: 'app-task-details-dialog',
  templateUrl: 'task-details-dialog.html',
  styleUrls: ['./task-details-dialog.css']
})
export class TaskDetailsDialog implements OnInit {
  form: any;
  title = "New task"

  constructor(public dialogRef: MatDialogRef<TaskDetailsDialog>, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: PTask) {
    if (data.title !== "") {
      this.title = "Edit task"
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      priority: [''],
      type: [''],
      status: [''],
      assignee: [''],
      description: [''],
      estimate: [0, [Validators.min(0)]],
    });
  }

  save() {
    this.dialogRef.close({ event: 'save', data: this.data });
  }
}

@Component({
  selector: 'app-task-history-dialog',
  templateUrl: 'task-history-dialog.html',
  styleUrls: ['./task-history-dialog.css']
})
export class TaskHistoryDialog implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: HistoryEvent[]) { }
  ngOnInit(): void {
    console.log(this.data);
  }
}

@Component({
  selector: 'app-task-delete-dialog',
  templateUrl: 'task-delete-dialog.html',
  styleUrls: ['./task-delete-dialog.css']
})
export class DeleteTaskDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteTaskDialog>, @Inject(MAT_DIALOG_DATA) public data: PTask) { }
  ngOnInit(): void {
    console.log(this.data);
  }

  onDelete() {
    this.dialogRef.close({ event: 'delete', data: this.data });
  }
}
