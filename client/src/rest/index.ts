export * from './token';

export interface ErrorsIp {
    [key: string]: string[];
    nonFieldErrors: string[];
}
export interface ErrorsOp {
    formFieldErrors: { [key: string]: string };
    formErrors: string[];
}

export const transformResponseErrorToFormError = (errors: ErrorsIp): ErrorsOp => {
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
