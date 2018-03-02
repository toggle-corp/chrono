import { RestRequest } from '../vendor/react-store/utils/rest';

// Alias for prepareQueryParams
interface Fn {
    (value: {[key: string]: (string | number | (string | number)[])}): string;
}
export const p: Fn = RestRequest.prepareUrlParams;

// FIXME: write comments
const reactAppApiHttps: (string | undefined) = location.protocol === 'https:'
    ? 'https'
    : process.env.REACT_APP_API_HTTPS;

export const wsEndpoint: string  = !process.env.REACT_APP_API_END
    ? 'http://localhost:8000/api/v1'
    : `${reactAppApiHttps}://${process.env.REACT_APP_API_END}/api/v1`;

export const adminEndpoint: string = !process.env.REACT_APP_ADMIN_END
    ? 'http://localhost:8000/admin/'
    : `${reactAppApiHttps}://${process.env.REACT_APP_ADMIN_END}/admin/`;

export enum Rest {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    PATCH = 'PATCH',
}

/*
export const POST = 'POST';
export const GET = 'GET';
export const PUT = 'PUT';
export const DELETE = 'DELETE';
export const PATCH = 'PATCH';
*/

interface Headers {
    Accept: string;
    'Content-Type': string;
    Authorization?: string;
}
interface AuthorizationHeaders {
    Authorization?: string;
}

export const commonHeaderForPostExternal: Headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};
export const commonHeaderForPost: Headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};
export const authorizationHeaderForPost: AuthorizationHeaders = {
};
