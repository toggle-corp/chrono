import { Users } from './user';
import { UserGroup } from './userGroup';
import { Project } from './project';
import { SlotData } from './slot';
import { Task } from './task';
import { Workspace, TimeslotViews } from './workspace';

export interface DomainData {
    projects: Project[];
    tasks: Task[];
    userGroups: UserGroup[];

    users: Users;

    activeDay: string;
    slotData: SlotData;
    workspace: Workspace;
    timeslotViews: TimeslotViews;
}
