import {
    wsEndpoint,
    Rest,
    commonHeaderForPost,
} from '../config/rest';
import {
    RestPostBody,
    PatchUserBody,
} from './interface';

export const urlForUsers: string = `${wsEndpoint}/users/`;

export const createUrlForUser = (userId: number): string => (
    `${wsEndpoint}/users/${userId}/`
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

export const createParamsForUserPatch = (
    { firstName, lastName }: PatchUserBody,
): RestPostBody => ({
    method: Rest.PATCH,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        firstName,
        lastName,
    }),
});
