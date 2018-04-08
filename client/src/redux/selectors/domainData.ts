import { createSelector } from 'reselect';
import {
    RootState,
    SlotData,
    UserGroup,
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

// FIXME: removet this with actual id from route
export const userIdFromRoute = ({}: RootState): number => 1;

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
// userIdFromRoute
export const userSelector = createSelector(
    userIdFromRoute,
    usersSelector,
    (userId, users) => (users[userId] || emptyObject),
);

export const userInformationSelector = createSelector(
    userSelector,
    user => (user.information || emptyObject),
);

export const userUserGroupsSelector = createSelector(
    userSelector,
    user => (user.userGroups || emptyArray),
);

export const userProjectsSelector = createSelector(
    userSelector,
    user => (user.projects || emptyArray),
);
