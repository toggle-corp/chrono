import { createSelector } from 'reselect';
import { userIdFromRouteSelector } from './route';
import {
    RootState,
    SlotData,
    UserGroup,
    UserProject,
    Workspace,
    Project,
    Task,
    TimeslotViews,
    Users,
} from '../interface';

const emptyObject = {};
const emptyArray: object[] = [];
const emptyFormState: object = {
    pristine: false,
    formErrors: {},
    formFieldErrors: {},
};

export const usersSelector = ({ domainData }: RootState): Users => (
    domainData.users || emptyObject
);

export const slotDataSelector = ({ domainData }: RootState): SlotData => (
    domainData.slotData || emptyObject
);

export const activeDaySelector = ({ domainData }: RootState): string => (
    domainData.activeDay
);

export const userGroupsSelector = ({ domainData }: RootState): UserGroup[] => (
    domainData.userGroups || emptyArray
);

export const workspaceSelector = ({ domainData }: RootState): Workspace => (
    domainData.workspace || emptyObject
);

export const timeslotViewSelector = ({ domainData }: RootState): TimeslotViews => (
    domainData.timeslotViews || emptyObject
);

export const projectsSelector = ({ domainData }: RootState): Project[] => (
    domainData.projects || emptyObject
);

export const tasksSelector = ({ domainData }: RootState): Task[] => (
    domainData.tasks || emptyObject
);

// COMPLEX
export const slotDataViewSelector = createSelector(
    slotDataSelector,
    activeDaySelector,
    (slotData, activeDay) => slotData[activeDay] || emptyObject,
);

export const workspaceActiveSelector = createSelector(
    workspaceSelector,
    workspace => workspace.active || emptyObject,
);

export const workspaceActiveDateSelector = createSelector(
    workspaceActiveSelector,
    active => active.date,
);

export const workspaceActiveTimeslotIdSelector = createSelector(
    workspaceActiveSelector,
    active => active.slot[active.date],
);

export const workspaceActiveTimeslotSelector = createSelector(
    workspaceSelector,
    workspaceActiveDateSelector,
    workspaceActiveTimeslotIdSelector,
    (workspace, date, id) => (
        workspace.timeslot[date] || emptyObject
    )[id] || emptyObject,
);

export const timeslotActiveViewSelector = createSelector(
    timeslotViewSelector,
    workspaceActiveTimeslotIdSelector,
    workspaceActiveTimeslotSelector,
    (timeslotView, id, original) => (
        timeslotView[id] || {
            data: original,
            ...emptyFormState,
        }
    ),
);

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
