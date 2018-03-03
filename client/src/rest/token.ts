import {
    wsEndpoint,
    Rest,
    commonHeaderForPost,
} from '../config/rest';
import { RestBody } from './interface';

export const urlForTokenCreate: string = `${wsEndpoint}/token/`;
export const createParamsForTokenCreate = (
    { username, password }:
    { username: string, password: string }
): RestBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        username,
        password,
    }),
});

export const urlForTokenRefresh = `${wsEndpoint}/token/refresh/`;
export const createParamsForTokenRefresh = (
    { refresh }: { refresh: string }
): RestBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        refresh,
    }),
});
