import {
    wsEndpoint,
    Rest,
    commonHeaderForPost,
} from '../config/rest';
import { RestGetBody, RestPostBody } from './interface';

export const urlForUsers: string = `${wsEndpoint}/users/`;

export const createParamsForUserRegister = (
    { firstName, lastName, username, password }:
    { firstName: string, lastName: string, username: string, password: string }
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

export const createParamsForUserGroups = (
    {}: {}  // TODO: find params!!
): RestGetBody => ({
    method: Rest.GET,
    headers: {},
});
