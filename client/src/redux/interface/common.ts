import { Auth } from './auth';
import { Notify } from './notify';
import { Route } from './route';
import { DomainData } from './domainData';
import { SiloDomainData } from './siloDomainData';

export interface RootState {
    domainData: DomainData;
    auth: Auth;
    notify: Notify;
    route: Route;
    siloDomainData: SiloDomainData;
}

export interface ReducerGroup<T> {
    [key: string]: ((state: T, action: object) => T);
}

export interface Ymd {
    year: number;
    month: number;
    day?: number;
}

export interface Dictionary<T> {
    [key: string]: T;
}

export const createPropsSelector = <T>(name: string) => (
    (state: RootState, props: object): T => props[name]
);
