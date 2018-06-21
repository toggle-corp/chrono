import { createSelector } from 'reselect';
import {
    getCanonicalDate,
    matchesCanonicalDate,
    filterObject,
} from '../../utils/map';
import {
    userIdFromRouteSelector,
    userGroupIdFromRouteSelector,
} from './route';
import { activeUserSelector } from './auth';
import {
    RootState,
    WorkspaceView,
    SlotStat,
    createPropsSelector,
    Ymd,
    Users,
    UserProject,
    UserGroup,
    UserGroups,
    Projects,
    Member,
} from '../interface';

const emptyObject = {};
const emptyArray: object[] = [];

const yearFromProps = createPropsSelector<number>('year');
const monthFromProps = createPropsSelector<number>('month');
const dayFromProps = createPropsSelector<number>('day');
const timeSlotIdFromProps = createPropsSelector<number|undefined>('timeSlotId');

const workspaceViewSelector = ({ siloDomainData }: RootState): WorkspaceView => (
    siloDomainData.workspace
);

const usersSelector = ({ siloDomainData }: RootState): Users => (
    siloDomainData.users || emptyObject
);

const userGroupsSelector = ({ siloDomainData }: RootState): UserGroups => (
    siloDomainData.userGroups || emptyObject
);

const projectsSelector = ({ siloDomainData }: RootState): Projects => (
    siloDomainData.projects || emptyObject
);

export const timeSlotStatsSelector = ({ siloDomainData }: RootState): SlotStat[] => (
    siloDomainData.slotStats || emptyArray
);

// COMPLEX

const projectsListSelector = createSelector(
    projectsSelector,
    projects => Object.keys(projects).map(
        projectId => projects[projectId],
    ).filter(project => project),
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
        userMembers.find(member => (
            member.member === activeUser.userId && member.role === 'admin'
        )) ? true : false
    ),
);

// Workspace
export const activeDateSelector = createSelector(
    workspaceViewSelector,
    (workspace) => {
        const activeDate = workspace.activeDate;
        if (!activeDate.year || !activeDate.month) {
            const now = new Date();
            const ymd: Ymd = {
                year: now.getFullYear(),
                month: now.getMonth() + 1,
            };
            return ymd;
        }
        return activeDate as Ymd;
    },
);

export const activeTimeSlotIdSelector = createSelector(
    workspaceViewSelector,
    workspace => workspace.activeTimeSlotId,
);

const timeSlotsSelector = createSelector(
    workspaceViewSelector,
    workspace => workspace.timeSlots,
);

const wipTimeSlotsSelector = createSelector(
    workspaceViewSelector,
    workspace => workspace.wipTimeSlots,
);

export const activeTimeSlotsSelector = createSelector(
    timeSlotsSelector,
    activeDateSelector,
    (timeSlots, activeDate) => (
        filterObject(
            timeSlots,
            (val, key) => matchesCanonicalDate(key, activeDate.year, activeDate.month),
    )
));

export const activeWipTimeSlotSelector = createSelector(
    wipTimeSlotsSelector,
    yearFromProps,
    monthFromProps,
    dayFromProps,
    timeSlotIdFromProps,
    (wipTimeSlots, year, month, day, timeSlotId = 0) => {
        const timeSlots = wipTimeSlots[getCanonicalDate(year, month, day)];
        if (timeSlots) {
            return timeSlots[timeSlotId];
        }
        return undefined;
    },
);
