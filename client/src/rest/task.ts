import {
    wsEndpoint,
    commonHeaderForPost,
    Rest,
} from '../config/rest';
import {
    RestPostBody,
    AddTaskParams,
  } from './interface';

export const urlForTasks: string = `${wsEndpoint}/tasks/`;

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
