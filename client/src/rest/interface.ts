import { RestRequest } from '../vendor/react-store/utils/rest';

export interface RestPostBody {
    method: string;
    headers: object;
    body: string;
}

export interface RestGetBody {
    method: string;
    headers: object;
}

export interface RestHeader {
    Accept: string;
    'Content-Type': string;
    Authorization?: string;
}

export interface RestAuthorizationHeader {
    Authorization?: string;
}

// FIXME: move form related parts outside
export interface FormConditionFnRule {
    message: string;
    truth(value: any): boolean; // tslint:disable-line no-any
}
export interface FormConditionFnRules {
    [key: string]: FormConditionFnRule[];
}

export interface FaramErrors {
    $internal?: undefined | string[];
    [key: string]: string | string[] | undefined | FaramErrors;
}

export interface FaramValues {
    [key: string]: any; // tslint:disable-line no-any
}

// FIXME: remove
export interface FormFieldErrors {
    [key: string]: string | undefined | FormFieldErrors;
}

// FIXME: remove
export type FormErrors = {
    errors?: (string | undefined)[] | undefined,
    fields?: {
        [key: string]: (undefined | FormErrors);
    },
};

// FIXME: remove
export interface ErrorsFromForm {
    formFieldErrors: FormFieldErrors;
    formErrors: FormErrors;
}

// FIXME: remove
export interface ValuesFromForm {
    [key: string]: any; // tslint:disable-line no-any
}

// FIXME: remove
export interface ErrorsFromServer {
    [key: string]: string[];
    nonFieldErrors: string[];
}

// tslint:disable-next-line no-any
type ConditionFn = (value: any) => { ok: boolean, message?: string };
type ConditionFns = ConditionFn[];
// tslint:disable-next-line no-any
type ValidationFn = (value: any) => string[];

interface ObjectSchema {
    validation?: ValidationFn;
    fields: {
        [key: string]: ObjectSchema | ConditionFns;
    };
}

interface ArraySchema {
    validation?: ValidationFn;
    members: ArraySchema | ObjectSchema | ConditionFns;
}

export type Schema = ArraySchema | ObjectSchema | ConditionFns;

export interface Request<T> {
    create: (value: T) => RestRequest;
}

export interface PostProjectBody {
    title: string;
    description: string;
    userGroup: number;
}

export interface PostUserGroupBody {
    title: string;
    description: string;
}

export interface PatchUserBody {
    firstName: string;
    lastName: string;
}

export interface AddTaskParams {
    project: number;
    title: string;
    description: string;
}
// FIXME: migrate the interface to make it modular.
export interface TableHeader<T> {
    key: string;
    label: string;
    order: number;
    sortable?: boolean;
    comparator?(a: T, b: T): number;
    modifier?(a: T): React.ReactNode;
}
