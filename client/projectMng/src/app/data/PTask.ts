export interface PTask {
    id: string;
    projectId: string;
    type: number;
    title: string;
    description: string;
    assignee: string;
    priority: number;
    status: number;
    estimate: number;
    createdAt: number;
    history: string[];
}