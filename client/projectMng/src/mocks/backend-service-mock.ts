import { Observable, of } from "rxjs";
import { HistoryEvent } from "src/app/data/HistoryEvent";
import { Project } from "src/app/data/Project";
import { PTask } from "src/app/data/PTask";

const projects: Project[] = [{ id: "aaa", name: "aaa", avatar: "", tasks: ["aaa", "bbb"] }, { id: "bbb", name: "bbb", avatar: "", tasks: [] }, { id: "ccc", name: "ccc", avatar: "", tasks: [] }]
const tasks: PTask[] = [{
    id: "aaa",
    projectId: "aaa",
    type: 0,
    title: "task1",
    description: "string",
    assignee: "string",
    priority: 0,
    status: 0,
    estimate: 0,
    createdAt: 0,
    history: []
},
{
    id: "bbb",
    projectId: "aaa",
    type: 0,
    title: "task2",
    description: "string",
    assignee: "string",
    priority: 0,
    status: 1,
    estimate: 0,
    createdAt: 0,
    history: []
}
]

export class BackendServiceServiceMock {
    getAllProjects(): Observable<Project[]> {
        return of(projects);
    }

    getAllTasksForAProject(projectId: string): Observable<PTask[]> {
        return of(tasks);
    }
}