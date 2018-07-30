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
export const createUrlForTags = (params: TagUrlParams): string => (
    `${wsEndpoint}/tags/?${p(params)}`
);

export const createParamsForPostTag = (
    { project, title, description }: AddTagParams,
): RestPostBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        project,
        title,
        description,
    }),
});
