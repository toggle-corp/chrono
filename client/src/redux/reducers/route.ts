import { Location } from 'history';
import { match as Match } from 'react-router';

import createReducerWithMap from '../../utils/createReducerWithMap';
import initialRouteState from '../initial-state/route';
import { isTruthy } from '#rsu/common';
import { Route, ReducerGroup } from '../interface';

import { AUTH_ACTION } from './auth';

// TYPE

export const enum ROUTE_ACTION {
    setParams = 'route/SET_PARAMS',
    clearParams = 'route/CLEAR_PARAMS',
}

// ACTION-CREATOR

export const setRouteParamsAction = (
    { match, location }: { match: Match<object>, location: Location},
) => ({
    match,
    location,
    type: ROUTE_ACTION.setParams,
});

export const clearRouteStateAction = () => ({
    type: ROUTE_ACTION.clearParams,
});

// HELPER

// NOTE: Route HERE
const urlValues = [
    'userId',
    'userGroupId',
    'projectId',
];

const transform = (params: object) => {
    const newParams = { ...params };
    urlValues.forEach((urlValue) => {
        if (isTruthy(newParams[urlValue])) {
            newParams[urlValue] = +newParams[urlValue];
        }
    });
    return newParams;
};

// REDUCER

const setRouteParams = (
    state: Route,
    action: { type: string, match: Match<object>, location: Location },
) => {
    const { path, url, isExact, params } = action.match;
    const { state: routeState } = action.location;

    const newState = {
        ...state,
        path,
        url,
        isExact,
        routeState,
        params: transform(params),
    };
    return newState;
};

const clearRouteState = (state: Route) => {
    const newState = {
        ...state,
        routeState: {},
    };
    return newState;
};

const logout = () => initialRouteState;

export const routeReducers: ReducerGroup<Route> = {
    [ROUTE_ACTION.setParams]: setRouteParams,
    [ROUTE_ACTION.clearParams]: clearRouteState,
    [AUTH_ACTION.logout]: logout,
};

const routeReducer = createReducerWithMap(routeReducers, initialRouteState);
export default routeReducer;
