import {
    Rest,
    commonHeaderForPost,
    p,
    wsEndpoint,
} from '../config/rest';
import {
    RestPostBody,
    SlotStatsUrlParams,
} from './interface';

export const urlForSlots: string = `${wsEndpoint}/time-slots/`;

export const createUrlForSlotStats = (params: SlotStatsUrlParams): string =>
    `${wsEndpoint}/time-slots-stats/?${p(params)}`;

export const createUrlForOverviewExport = (params: SlotStatsUrlParams): string =>
    `${wsEndpoint}/export/?${p(params)}`;

export const createUrlForProjectWiseSlotStats = (params: SlotStatsUrlParams): string =>
    `${wsEndpoint}/time-slots-stats/project-wise/?${p(params)}`;

export const createUrlForDayWiseSlotStats = (params: SlotStatsUrlParams): string =>
    `${wsEndpoint}/time-slots-stats/day-wise/?${p(params)}`;

export const createUrlForSlot = (slotId: number): string => `${wsEndpoint}/time-slots/${slotId}/`;

export const createParamsForPostSlot = (
    { date, startTime, endTime, task, user, remarks }:
    {
        date?: string,
        startTime?: string,
        endTime?: string,
        task?: number,
        user?: number,
        remarks?: string,
    },
): RestPostBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        date,
        startTime,
        endTime,
        task,
        user,
        remarks,
    }),
});

export const createParamsForPutSlot = (
    { date, startTime, endTime, task, user, remarks }:
    {
        date?: string,
        startTime?: string,
        endTime?: string,
        task?: number,
        user?: number,
        remarks?: string,
    },
): RestPostBody => ({
    method: Rest.PUT,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        date,
        startTime,
        endTime,
        task,
        user,
        remarks,
    }),
});
