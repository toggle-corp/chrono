// FIXME: move form related parts outside

export interface RestBody {
    method: string;
    headers: object;
    body: string;
}

export interface RestHeader {
    Accept: string;
    'Content-Type': string;
    Authorization?: string;
}

export interface RestAuthorizationHeader {
    Authorization?: string;
}

export interface FormValidationRule {
    message: string;
    truth(value: any): boolean; // tslint:disable-line no-any
}
export interface FormValidationRules {
    [key: string]: FormValidationRule[];
}

export interface FormFieldErrors {
    [key: string]: string;
}
export type FormErrors = string[];

export interface ErrorsFromForm {
    formFieldErrors: FormFieldErrors;
    formErrors: FormErrors;
}

export interface ValuesFromForm {
    [key: string]: any; // tslint:disable-line no-any
}

export interface ErrorsFromServer {
    [key: string]: string[];
    nonFieldErrors: string[];
}
