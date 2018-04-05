import {
    wsEndpoint,
    Rest,
    commonHeaderForPost,
    commonHeaderForGet,
} from '../config/rest';
import {
    UserIdFromRoute,
} from '../redux/interface';
import { RestGetBody, RestPostBody } from './interface';

export const urlForUsers: string = `${wsEndpoint}/users/`;
export const createUrlForUsers = (userId: UserIdFromRoute): string => (
    `${wsEndpoint}/users/${userId}`
);

export const createParamsForUserRegister = (
    { firstName, lastName, username, password }:
    { firstName: string, lastName: string, username: string, password: string },
): RestPostBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        firstName,
        lastName,
        username,
        password,
    }),
});

export const urlForUserGroups: string = `${wsEndpoint}/user-groups/`;

export const createParamsForUserGroups = (): RestGetBody => ({
    method: Rest.GET,
    headers: commonHeaderForGet,
});
