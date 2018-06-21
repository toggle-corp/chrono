import { UserGroup } from './userGroup';
import { Project } from './project';
import { Task } from './task';
import { UserPartialInformation } from './user';

export interface DomainData {
    tasks: Task[];
    projects: Project[];
    userGroups: UserGroup[];
    users: UserPartialInformation[];
}
