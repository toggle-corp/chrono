import {
    Dictionary,
    Task,
} from '../../interface';

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

export interface ProjectView {
    detail: Project;
    tasks: Task[];
}

// For Silo
export type Projects = Dictionary<Project>;
export type ProjectsView = Dictionary<ProjectView>;

export interface SetProjectAction {
    userId?: number;
    project: Project;
}

export interface SetProjectTasksAction {
    projectId: number;
    tasks: Task[];
}
