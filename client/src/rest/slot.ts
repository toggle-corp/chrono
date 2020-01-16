import {
    Rest,
    commonHeaderForPost,
    p,
    wsEndpoint,
} from '../config/rest';
import {
    RestPostBody,
    SlotStatsUrlParams,
    PostSlotParams,
    PutSlotParams,
    SlotsByYearParams,
} from './interface';

export const urlForSlots: string = `${wsEndpoint}/time-slots/`;

export const createUrlForSlotsByYear = (params: SlotsByYearParams): string =>
    `${urlForSlots}?${p(params)}`;

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
    params: PostSlotParams,
): RestPostBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify(params),
});

export const createParamsForPutSlot = (
    params: PutSlotParams,
): RestPostBody => ({
    method: Rest.PUT,
    headers: commonHeaderForPost,
    body: JSON.stringify(params),
});
