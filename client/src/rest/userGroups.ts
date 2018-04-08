import {
    wsEndpoint,
    Rest,
    commonHeaderForGet,
    p,
} from '../config/rest';
import { RestGetBody } from './interface';

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
