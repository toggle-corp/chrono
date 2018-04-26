import {
    wsEndpoint,
    Rest,
    commonHeaderForPost,
} from '../config/rest';
import {
    RestPostBody,
    PostSlotBody,
    PatchSlotBody,
} from './interface';

export const urlForSlot: string = `${wsEndpoint}/time-slots/`;
export const createUrlForSlot = (slotId: number): string => `${wsEndpoint}/time-slots/${slotId}/`;

export const createParamsForPostSlot = (
    { date, startTime, endTime, task, user, remarks }: PostSlotBody,
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

export const createParamsForPatchSlot = (
    { date, startTime, endTime, task, user, remarks }: PatchSlotBody,
): RestPostBody => ({
    method: Rest.PATCH,
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
