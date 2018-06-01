import { createSelector } from 'reselect';
import {
    userIdFromRouteSelector,
    userGroupIdFromRouteSelector,
} from './route';
import {
    RootState,
    UserGroup,
    UserProject,
    Project,
    Task,
    Users,
    Member,
} from '../interface';
import {
    activeUserSelector,
} from './auth';

const emptyObject = {};
const emptyArray: object[] = [];

export const usersSelector = ({ domainData }: RootState): Users => (
    domainData.users || emptyObject
);

export const userGroupsSelector = ({ domainData }: RootState): UserGroup[] => (
    domainData.userGroups || emptyArray
);

export const projectsSelector = ({ domainData }: RootState): Project[] => (
    domainData.projects || emptyObject
);

export const tasksSelector = ({ domainData }: RootState): Task[] => (
    domainData.tasks || emptyObject
);

// COMPLEX

// userIdFromRouteSelector
export const userSelector = createSelector(
    userIdFromRouteSelector,
    usersSelector,
    (userId, users) => userId ? users[userId] : undefined,
);

export const userInformationSelector = createSelector(
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
    projectsSelector,
    (userGroupId, projects) => (
        projects.filter(project => project.userGroup === userGroupId)
    ),
);

export const userGroupSelector = createSelector(
    userGroupIdFromRouteSelector,
    userGroupsSelector,
    (userGroupId, userGroups) => (
        userGroups.find(usergroup => usergroup.id === userGroupId)
    ),
);

export const userGroupMembersSelector = createSelector(
    userGroupSelector,
    userGroup => (userGroup ? userGroup.memberships : undefined) || (emptyArray as Member[]),
);

export const isUserAdminSelector = createSelector(
    activeUserSelector,
    userGroupMembersSelector,
    (activeUser, userMembers) => (
        userMembers.find(member => (
            member.member === activeUser.userId && member.role === 'admin'
        )) ? true : false
    ),
);
