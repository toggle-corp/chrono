import { UserGroup } from './userGroup';
import { Project } from './project';
import { Task } from './task';
import { Tag } from './tag';
import { UserPartialInformation } from './user';

export interface DomainData {
    tasks: Task[];
    tags: Tag[];
    projects: Project[];
    userGroups: UserGroup[];
    users: UserPartialInformation[];
}
