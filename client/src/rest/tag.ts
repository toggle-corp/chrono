import {
    wsEndpoint,
    commonHeaderForPost,
    Rest,
    p,
} from '../config/rest';
import {
    RestPostBody,
    AddTagParams,
    TagUrlParams,
} from './interface';

export const urlForTags: string = `${wsEndpoint}/tags/`;
export const createUrlForTag = (tagId: number): string => `${wsEndpoint}/tags/${tagId}/`;
export const createUrlForTags = (params: TagUrlParams): string => (
    `${wsEndpoint}/tags/?${p(params)}`
);

export const createParamsForPostTag = (
    params: AddTagParams,
): RestPostBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify(params),
});

export const createParamsForPutTag = (
    params: AddTagParams,
): RestPostBody => ({
    method: Rest.PUT,
    headers: commonHeaderForPost,
    body: JSON.stringify(params),
});
