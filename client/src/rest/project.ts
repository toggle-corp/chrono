import {
    Rest,
    commonHeaderForGet,
    commonHeaderForPost,
    p,
    wsEndpoint,
} from '../config/rest';
import {
    RestGetBody,
    RestPostBody,
    PostProjectBody,
} from './interface';
export type ProjectUrlParams = {
    fields?: string[];
    user?: number;
};

export const urlForProjects: string = `${wsEndpoint}/projects/`;
export const createUrlForProjects = (params: ProjectUrlParams): string => (
    `${wsEndpoint}/projects/?${p(params)}`
);

export const createUrlForProject = (projectId: number): string =>
    `${wsEndpoint}/projects/${projectId}`;

export const createParamsForGetProjects = (): RestGetBody => ({
    method: Rest.GET,
    headers: commonHeaderForGet,
});

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
