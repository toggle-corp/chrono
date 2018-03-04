import { RestRequest } from '../vendor/react-store/utils/rest';
import { RestHeader, RestAuthorizationHeader } from '../rest/interface';

// Just an alias for prepareQueryParams
export const p: {
    (value: {[key: string]: (string | number | (string | number)[])}): string;
} = RestRequest.prepareUrlParams;

// FIXME: write comment for this statement
const reactAppApiHttps: (string | undefined) = location.protocol === 'https:'
    ? 'https'
    : process.env.REACT_APP_API_HTTPS;

export const wsEndpoint: string  = !process.env.REACT_APP_API_END
    ? 'http://localhost:8000/api/v1'
    : `${reactAppApiHttps}://${process.env.REACT_APP_API_END}/api/v1`;

export const adminEndpoint: string = !process.env.REACT_APP_ADMIN_END
    ? 'http://localhost:8000/admin/'
    : `${reactAppApiHttps}://${process.env.REACT_APP_ADMIN_END}/admin/`;

// Available rest methods
export enum Rest {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

// NOTE: These are modified in runtime
export const commonHeaderForPostExternal: RestHeader = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};
export const commonHeaderForPost: RestHeader = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};
export const authorizationHeaderForPost: RestAuthorizationHeader = {
};
