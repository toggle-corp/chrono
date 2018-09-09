import {
    wsEndpoint,
    commonHeaderForPost,
    Rest,
    p,
} from '../config/rest';
import {
    RestPostBody,
    AddTaskParams,
    TaskUrlParams,
} from './interface';

export const urlForTasks: string = `${wsEndpoint}/tasks/`;
export const createUrlForTask = (taskId: number): string => `${wsEndpoint}/tasks/${taskId}/`;
export const createUrlForTasks = (params: TaskUrlParams): string => (
    `${wsEndpoint}/tasks/?${p(params)}`
);

export const createParamsForPostTask = (
    params: AddTaskParams,
): RestPostBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify(params),
});

export const createParamsForPutTask = (
    params: AddTaskParams,
): RestPostBody => ({
    method: Rest.PUT,
    headers: commonHeaderForPost,
    body: JSON.stringify(params),
});
