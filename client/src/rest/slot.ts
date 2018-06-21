import {
    Rest,
    commonHeaderForPost,
    p,
    PP,
    wsEndpoint,
} from '../config/rest';
import {
    RestPostBody,
    SlotStatsUrlParams,
} from './interface';

// helper

const stringToUnderscore = (text: string): string => (
    text.replace(
        /([A-Z])/g,
        a => ('_' + a.toLowerCase()),
    )
);

const toUnderscore = (params: object): PP => (
    Object.keys(params).length ? Object.keys(params).reduce(
        (acc, key) => {
            acc[stringToUnderscore(key)] = params[key];
            return acc;
        },
        {}) : {}
);

export const urlForSlots: string = `${wsEndpoint}/time-slots/`;
export const createUrlForSlotStats = (params: SlotStatsUrlParams): string =>
    `${wsEndpoint}/time-slots-stats/?${p(toUnderscore(params))}`;

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
