import { UserGroup } from './userGroup';
import { Project } from './project';

// ENTITY INTERFACE
export interface UserInformation {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
}

export interface UserUserGroup extends UserGroup {
    role?: string;
}

export interface UserProject extends Project {
    role?: string;
}

export interface User {
    information: UserInformation;
    userGroups: UserUserGroup[];
    projects: UserProject[];
}

export interface Users {
    [key: string]: User;
}

// ACTION INTERFACE

export interface SetUserAction extends Partial<User> {
    userId: number;
}

export interface UnsetUserUserGroupAction {
    userId: number;
    userGroup: UserUserGroup;
}

export interface UnsetUserProjectAction {
    userId: number;
    project: UserProject;
}
