import { createSelector } from 'reselect';
import { RootState, DayData, UserGroup } from '../interface';

const emptyObject = {};

export const dayDataSelector = ({ domainData }: RootState): DayData => (
    domainData.dayData || emptyObject
);

export const activeDaySelector = ({ domainData }: RootState): number => (
    domainData.activeDay
);

export const userGroupsSelector = ({ domainData }: RootState): UserGroup[] => (
    domainData.userGroups
);

// COMPLEX
export const dayDataViewSelector = createSelector(
    dayDataSelector,
    activeDaySelector,
    (dayData, activeDay) => dayData[activeDay] || emptyObject,
);
