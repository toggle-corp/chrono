import {
    wsEndpoint,
    Rest,
    commonHeaderForPost,
} from '../config/rest';
import { RestPostBody } from './interface';

export const urlForSlots: string = `${wsEndpoint}/time-slots/`;

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
