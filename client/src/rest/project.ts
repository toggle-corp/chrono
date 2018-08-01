import {
    Rest,
    commonHeaderForPost,
    p,
    wsEndpoint,
} from '../config/rest';
import {
    RestPostBody,
    ProjectUrlParams,
    PostProjectBody,
} from './interface';

// get all projects
export const urlForProjects: string = `${wsEndpoint}/projects/`;

// get projects with filter
export const createUrlForProjects = (params: ProjectUrlParams): string => (
    `${wsEndpoint}/projects/?${p(params)}`
);

// get a project
export const createUrlForProject = (projectId: number): string =>
    `${wsEndpoint}/projects/${projectId}/`;

export const createParamsForPostProject = (
    { title, description, userGroup }: PostProjectBody,
): RestPostBody => ({
    method: Rest.POST,
    headers: commonHeaderForPost,
    body: JSON.stringify({
        title,
        description ,
        userGroup,
    }),
});
