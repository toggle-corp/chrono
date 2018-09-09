import { RestRequest } from '#rsu/rest';
import { RestHeader, RestAuthorizationHeader } from '../rest/interface';

export interface PP {
    [key: string]: (undefined | string | number | (string | number)[]);
}

// Just an alias for prepareQueryParams
export const p: { (value: PP): string } = RestRequest.prepareUrlParams;

// if client is secure, server must be secure
// else use whatever server is using
const clientProtocol = location.protocol;
const serverProtocol = process.env.REACT_APP_API_HTTPS;
const protocol: (string | undefined) = clientProtocol === 'https:'
    ? 'https'
    : serverProtocol || 'http';

const serverEndpoint = process.env.REACT_APP_API_END;
const url = serverEndpoint || 'localhost:8010';

export const wsEndpoint: string  = `${protocol}://${url}/api/v1`;
export const adminEndpoint: string = `${protocol}://${url}/admin/`;

// Available rest methods
export const enum Rest {
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
export const commonHeaderForGet: RestHeader = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};
export const authorizationHeaderForPost: RestAuthorizationHeader = {
};
