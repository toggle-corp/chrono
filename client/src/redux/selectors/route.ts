import { createSelector } from 'reselect';
import { RootState } from '../interface';

export const routeUrlSelector = ({ route }: RootState) => (route.url);

export const routeParamsSelector = ({ route }: RootState) => (route.params);

export const routeStateSelector = ({ route }: RootState) => (route.routeState);

export const userIdFromRouteSelector = createSelector(
    routeParamsSelector,
    routeParams => routeParams ? routeParams.userId : 0,
);
