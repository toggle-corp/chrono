import {
    Rest,
    commonHeaderForGet,
    p,
    wsEndpoint,
} from '../config/rest';
import { RestGetBody } from './interface';
import { UserIdFromRoute } from '../redux/interface';
export type ProjectUrlParams = {
    fields?: string[];
    user?: UserIdFromRoute;
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
