import {
    ErrorsFromServer,
    RestGetBody,
    FaramErrors,
} from './interface';
import {
    Rest,
    commonHeaderForGet,
} from '../config/rest';

export const alterResponseErrorToFaramError = (errors: ErrorsFromServer): FaramErrors => {
    const { nonFieldErrors = [], ...formFieldErrorList } = errors;

    return Object.keys(formFieldErrorList).reduce(
        (acc, key) => {
            acc[key] = formFieldErrorList[key].join(' ');
            return acc;
        },
        {
            $internal: nonFieldErrors,
        },
    );
};

export const commonParamsForGet = (): RestGetBody => ({
    method: Rest.GET,
    headers: commonHeaderForGet,
});

export const commonParamsForDelete = (): RestGetBody => ({
    method: Rest.DELETE,
    headers: commonHeaderForGet,
});

export * from './token';
export * from './user';
export * from './userGroups';
export * from './slot';
export * from './project';
export * from './task';
export * from './groupMemberships';
