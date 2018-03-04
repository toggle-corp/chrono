import { ErrorsFromServer, ErrorsFromForm } from './interface';

export const transformResponseErrorToFormError = (errors: ErrorsFromServer): ErrorsFromForm => {
    const { nonFieldErrors: formErrors = [], ...formFieldErrorList } = errors;
    const formFieldErrors = Object.keys(formFieldErrorList).reduce(
        (acc, key) => {
            acc[key] = formFieldErrorList[key].join(' ');
            return acc;
        },
        {},
    );
    return { formFieldErrors, formErrors };
};
export * from './token';
