export interface  HistoryEvent {
    id: string;    
    projectId: string; 
    createdAt: number;   
    taskId: string;    
    field: string;    
    oldValue: string;    
    newValue: string;
}