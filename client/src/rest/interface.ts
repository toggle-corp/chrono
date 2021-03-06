import { RestRequest } from '#rsu/rest';

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
    group: number;
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

export interface PostSlotParams {
    date?: string;
    startTime?: string;
    endTime?: string;
    task?: number;
    remarks?: string;
    tag?: number[];
}

export type PutSlotParams = PostSlotParams;

export interface AddTaskParams {
    project: number;
    title: string;
    description: string;
}

export type TaskUrlParams = {
    fields?: string[];
    project?: number;
};

export interface AddTagParams extends AddTaskParams { }

export type TagUrlParams = TaskUrlParams;

export type ProjectUrlParams = {
    fields?: string[];
    user?: number;
    user_group?:number;
};

export type SlotStatsUrlParams = {
    project?: (number | number[]);
    user_group?: (number | number[]);
    task?: (number | number[]);
    user?: (number | number[]);
    tag?: (number | number[]);
    date_gt?: string;
    date_lt?: string;
};

export type SlotsByYearParams = {
    date_gt?: string;
    date_lt?: string;
};
