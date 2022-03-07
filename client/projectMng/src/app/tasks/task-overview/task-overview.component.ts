import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PTask } from 'src/app/data/PTask';

@Component({
  selector: 'app-task-overview',
  templateUrl: './task-overview.component.html',
  styleUrls: ['./task-overview.component.css']
})
export class TaskOverviewComponent implements OnInit {

  @Input() task: PTask | undefined;
  @Input() index = -1;
  @Output() editEm = new EventEmitter();
  @Output() historyEm = new EventEmitter();
  @Output() deleteEm = new EventEmitter();

  date: Date = new Date();
  status = "To Do";

  constructor() {

  }

  ngOnInit(): void {

    if (this.task) {
      this.date = new Date(this.task.createdAt * 1000);
      switch (this.task.status) {
        case 0:
          this.status = "To Do";
          break;
        case 1:
          this.status = "In Progress";
          break;
        case 2:
          this.status = "Ready For Test";
          break;
        case 3:
          this.status = "Done";
          break;
      }

    }
  }

  onEditClick(taskId?: string) {
    this.editEm.emit(taskId);
  }

  onHistoryClick(taskId?: string) {
    this.historyEm.emit(taskId);
  }

  onDeleteClick(taskId?: string) {
    this.deleteEm.emit(taskId);
  }
}
