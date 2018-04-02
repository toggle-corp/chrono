import { createSelector } from 'reselect';
import { RootState, SlotData, UserGroup } from '../interface';

const emptyObject = {};

export const slotDataSelector = ({ domainData }: RootState): SlotData => (
    domainData.slotData || emptyObject
);

export const activeDaySelector = ({ domainData }: RootState): number => (
    domainData.activeDay
);

// FIXME: Use empty array here
export const userGroupsSelector = ({ domainData }: RootState): UserGroup[] => (
    domainData.userGroups
);

// COMPLEX
export const slotDataViewSelector = createSelector(
    slotDataSelector,
    activeDaySelector,
    (slotData, activeDay) => slotData[activeDay] || emptyObject,
);
