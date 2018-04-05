import {
    wsEndpoint,
    Rest,
    commonHeaderForGet,
} from '../config/rest';
import { RestGetBody } from './interface';

export const urlForProjects: string = `${wsEndpoint}/projects/`;


export const createParamsForGetProjects = (): RestGetBody => ({
    method: Rest.GET,
    headers: commonHeaderForGet,
});
