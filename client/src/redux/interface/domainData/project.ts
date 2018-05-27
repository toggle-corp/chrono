export interface Project {
    id: number;
    title: string;
    userGroup: number;
    createdAt: string;
    modifiedAt: string;
    createdBy: number;
    modifiedBy: number;
    createdByName: string;
    modifiedByName: string;
    description: string;
}

export interface SetProjectAction {
    userId?: number;
    project: Project;
}
