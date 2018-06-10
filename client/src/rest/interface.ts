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

export interface ErrorsFromServer {
    [key: string]: string[];
    nonFieldErrors: string[];
}

export interface Request<T> {
    create: (value: T) => RestRequest;
}

export interface PostProjectBody {
    title: string;
    description: string;
    userGroup: number;
}

export interface PostGroupMembershipBody {
    member: number;
    group?: number;
    role: string;
}

export interface PostUserGroupBody {
    title: string;
    description: string;
}

export interface PatchUserGroupBody {
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
