import {
    wsEndpoint,
    Rest,
    commonHeaderForGet,
    commonHeaderForPost,
    p,
} from '../config/rest';
import {
    RestGetBody,
    RestPostBody,
    PostUserGroupBody,
} from './interface';

export type UserGroupUrlParams = {
    fields?: string[];
    user?: number;
};

export const urlForUserGroups: string = `${wsEndpoint}/user-groups/`;
export const createUrlForUserGroups = (params: UserGroupUrlParams): string => (
    `${wsEndpoint}/user-groups/?${p(params)}`
);

export const createUrlForUserGroup = (userGroupId: number): string =>
    `${wsEndpoint}/user-groups/${userGroupId}`;

export const createParamsForUserGroups = (): RestGetBody => ({
    method: Rest.GET,
    headers: commonHeaderForGet,
});

export const createParamsForPostUserGroup = (
    { title, description }: PostUserGroupBody,
): RestPostBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        title,
        description ,
    }),
});
