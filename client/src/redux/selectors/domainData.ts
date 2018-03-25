import { createSelector } from 'reselect';
import { RootState, DayData } from '../interface';

const emptyObject = {};

export const dayDataSelector = ({ domainData }: RootState): DayData => (
    domainData.dayData || emptyObject
);

export const activeDaySelector = ({ domainData }: RootState): number => (
    domainData.activeDay
);

// COMPLEX
export const dayDataViewSelector = createSelector(
    dayDataSelector,
    activeDaySelector,
    (dayData, activeDay) => dayData[activeDay] || emptyObject,
);
