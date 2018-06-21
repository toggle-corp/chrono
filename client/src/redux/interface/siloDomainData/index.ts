import {
    Projects,
    SlotStat,
    Users,
    UserGroups,
    WorkspaceView,
} from '../../interface';

export interface SiloDomainData {
    workspace: WorkspaceView;
    slotStats: SlotStat[];
    userGroups: UserGroups;
    users: Users;
    projects: Projects;
}
