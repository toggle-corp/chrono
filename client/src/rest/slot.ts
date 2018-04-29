import {
    wsEndpoint,
    Rest,
    commonHeaderForPost,
} from '../config/rest';
import { RestPostBody } from './interface';

export const urlForSlots: string = `${wsEndpoint}/time-slots/`;

export const urlForSlot: string = `${wsEndpoint}/time-slots/`;

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
