import {
    wsEndpoint,
    Rest,
    commonHeaderForGet,
} from '../config/rest';
import { RestGetBody } from './interface';

export const urlForTasks: string = `${wsEndpoint}/tasks/`;


export const createParamsForGetTasks = (): RestGetBody => ({
    method: Rest.GET,
    headers: commonHeaderForGet,
});
