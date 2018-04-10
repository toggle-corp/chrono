import { Auth } from './auth';
import { Notify } from './notify';
import { Route } from './route';

import { Users } from './user';
import { UserGroup } from './userGroup';
import { Project } from './project';
import { SlotData } from './slot';
import { Task } from './task';
import { Workspace, TimeslotViews } from './workspace';

export interface DomainData {
    activeDay: string;
    userGroups: UserGroup[];
    projects: Project[];
    tasks: Task[];
    slotData: SlotData;
    workspace: Workspace;
    timeslotViews: TimeslotViews;
    users: Users;
}

export interface RootState {
    domainData: DomainData;
    auth: Auth;
    notify: Notify;
    route: Route;
}

export interface ReducerGroup<T> {
    [key: string]: ((state: T, action: object) => T);
}
