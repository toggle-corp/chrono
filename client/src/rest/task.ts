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
export const createUrlForTasks = (params: TaskUrlParams): string => (
    `${wsEndpoint}/tasks/?${p(params)}`
);

export const createParamsForPostTask = (
    { project, title, description }: AddTaskParams,
): RestPostBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        project,
        title,
        description,
    }),
});
