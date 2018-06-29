import {
    ProjectsView,
    Dashboard,
    Users,
    UserGroups,
    WorkspaceView,
} from '../../interface';

export interface SiloDomainData {
    workspace: WorkspaceView;
    dashboard: Dashboard;
    userGroups: UserGroups;
    users: Users;
    projects: ProjectsView;
}
