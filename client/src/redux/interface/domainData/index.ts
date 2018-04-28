import { Users } from './user';
import { UserGroup } from './userGroup';
import { Project } from './project';
import { Task } from './task';

export interface DomainData {
    projects: Project[];
    tasks: Task[];
    userGroups: UserGroup[];
    users: Users;
}
