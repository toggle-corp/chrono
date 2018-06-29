import { createSelector } from 'reselect';
import { RootState } from '../interface';

// NOTE: Route HERE
export const routeUrlSelector = ({ route }: RootState) => (route.url);

export const routeParamsSelector = ({ route }: RootState) => (route.params);

export const routeStateSelector = ({ route }: RootState) => (route.routeState);

export const userIdFromRouteSelector = createSelector(
    routeParamsSelector,
    routeParams => routeParams ? routeParams.userId : 0,
);

export const userGroupIdFromRouteSelector = createSelector(
    routeParamsSelector,
    routeParams => routeParams ? routeParams.userGroupId : 0,
);

export const projectIdFromRouteSelector = createSelector(
    routeParamsSelector,
    routeParams => routeParams ? routeParams.projectId : 0,
);
