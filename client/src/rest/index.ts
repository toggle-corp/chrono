import {
    ErrorsFromServer,
    ErrorsFromForm,
    RestGetBody,
} from './interface';
import {
    Rest,
    commonHeaderForGet,
} from '../config/rest';

export const transformResponseErrorToFormError = (errors: ErrorsFromServer): ErrorsFromForm => {
    const {
        nonFieldErrors = [],
        ...formFieldErrorList,
    }: {
        nonFieldErrors: string[];
    } = errors;
    const formErrors = {
        errors: nonFieldErrors,
    };

    const formFieldErrors = Object.keys(formFieldErrorList).reduce(
        (acc, key) => {
            acc[key] = formFieldErrorList[key].join(' ');
            return acc;
        },
        {},
    );
    return { formFieldErrors, formErrors };
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
