import { createSelector } from 'reselect';
import { filterObject } from '../../utils/map';
import {
    RootState,
    WorkspaceView,

} from '../interface';

const createPropsSelector = <T>(name: string) => (
    (state: RootState, props: object): T => props[name]
);

const yearFromProps = createPropsSelector<number>('year');
const monthFromProps = createPropsSelector<number>('month');
const dayFromProps = createPropsSelector<number>('day');
const timeSlotIdFromProps = createPropsSelector<number|undefined>('timeSlotId');

const workspaceViewSelector = ({ siloDomainData }: RootState): WorkspaceView => (
    siloDomainData.workspace
);

interface Ymd {
    year: number;
    month: number;
    day?: number;
}

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

export const activeTimeslotIdSelector = createSelector(
    workspaceViewSelector,
    workspace => workspace.activeTimeslotId,
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
            (val, key) => key.startsWith(`${activeDate.year}-${activeDate.month}`))
    ),
);

export const activeWipTimeSlotSelector = createSelector(
    wipTimeSlotsSelector,
    yearFromProps,
    monthFromProps,
    dayFromProps,
    timeSlotIdFromProps,
    (wipTimeSlots, year, month, day, timeSlotId = 0) => {
        const timeSlots = wipTimeSlots[`${year}-${month}-${day}`];
        if (timeSlots) {
            return timeSlots[timeSlotId];
        }
        return undefined;
    },
);
