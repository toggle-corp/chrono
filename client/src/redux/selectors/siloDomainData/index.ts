import { createSelector } from 'reselect';
import {
    userIdFromRouteSelector,
    userGroupIdFromRouteSelector,
    projectIdFromRouteSelector,
} from '../route';
import { activeUserSelector } from '../auth';
import {
    RootState,
    Users,
    UserProject,
    UserGroup,
    UserGroups,
    ProjectView,
    ProjectsView,
    Project,
    Member,
    Task,
    Tag,
} from '../../interface';

const emptyObject = {};
const emptyArray: object[] = [];

const usersSelector = ({ siloDomainData }: RootState): Users => (
    siloDomainData.users || emptyObject
);

const userGroupsSelector = ({ siloDomainData }: RootState): UserGroups => (
    siloDomainData.userGroups || emptyObject
);

const projectsSelector = ({ siloDomainData }: RootState): ProjectsView => (
    siloDomainData.projects || emptyObject
);

// COMPLEX

const projectsListSelector = createSelector(
    projectsSelector,
    projects => Object.keys(projects).map(
        projectId => projects[projectId] ? projects[projectId].detail : undefined,
    ).filter(project => project) as Project[],
);

// userIdFromRouteSelector
const userSelector = createSelector(
    userIdFromRouteSelector,
    usersSelector,
    (userId, users) => userId ? users[userId] : undefined,
);

export const userProfileInformationSelector = createSelector(
    userSelector,
    user => user ? user.information : undefined,
);

export const userUserGroupsSelector = createSelector(
    userSelector,
    user => (user ? user.userGroups : undefined) || (emptyArray as UserGroup[]),
);

export const userProjectsSelector = createSelector(
    userSelector,
    user => (user ? user.projects : undefined) || (emptyArray as UserProject[]),
);

export const userGroupProjectsSelector = createSelector(
    userGroupIdFromRouteSelector,
    projectsListSelector,
    (userGroupId, projects) => (
        projects.filter(project => project.userGroup === userGroupId)
    ),
);

export const userGroupSelector = createSelector(
    userGroupIdFromRouteSelector,
    userGroupsSelector,
    (userGroupId, userGroups) => userGroupId ? userGroups[userGroupId] : undefined,
);

export const userGroupMembersSelector = createSelector(
    userGroupSelector,
    userGroup => (userGroup ? userGroup.memberships : undefined) || (emptyArray as Member[]),
);

export const isUserAdminSelector = createSelector(
    activeUserSelector,
    userGroupMembersSelector,
    (activeUser, userMembers) => (
        !!userMembers.find(member => (
            member.member === activeUser.userId && member.role === 'admin'
        ))
    ),
);

export const projectViewSelector = createSelector(
    projectIdFromRouteSelector,
    projectsSelector,
    (projectId, projects) => projects[projectId || 0] || emptyObject as ProjectView,
);

export const projectSelector = createSelector(
    projectViewSelector,
    project => project.detail,
);

export const projectTasksSelector = createSelector(
    projectViewSelector,
    project => project.tasks || emptyArray as Task[],
);

export const projectTagsSelector = createSelector(
    projectViewSelector,
    project => project.tags || emptyArray as Tag[],
);
