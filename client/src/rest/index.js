export * from './token';

export const transformResponseErrorToFormError = (errors) => {
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
