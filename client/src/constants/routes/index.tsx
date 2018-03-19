import React from 'react';
import ViewManager from '../../components/ViewManager';
import { mapObjectToArray, mapObjectToObject, Map } from '../../utils/map';
import { allLinks, noLinks } from './links';
import { RouteSetting, ROUTE, CloakSettings } from './interface';

// NOTE: only change values in routes
export const routes: Map<RouteSetting> = {
    login: {
        order: 1,
        type: ROUTE.exclusivelyPublic,
        redirectTo: '/',
        path: '/login',
        loader: () => import('../../views/Login'),
        links: noLinks,
        hideNavbar: true,
    },

    register: {
        order: 2,
        type: ROUTE.exclusivelyPublic,
        redirectTo: '/',
        path: '/register',
        loader: () => import('../../views/Register'),
        links: noLinks,
        hideNavbar: true,
    },

    timeline: {
        order: 3,
        type: ROUTE.private,
        path: '/timeline',
        loader: () => import('../../views/Timeline'),
        links: allLinks,
    },

    profile: {
        order: 4,
        type: ROUTE.private,
        path: '/profile',
        loader: () => import('../../views/Profile'),
        links: allLinks,
    },

    workspace: {
        order: 5,
        type: ROUTE.private,
        path: '/',
        loader: () => import('../../views/Workspace'),
        links: allLinks,
    },

    // NOTE: 404 page should always be at the end
    notFound: {
        order: 6,
        type: ROUTE.public,
        path: undefined,
        loader: () => import('../../views/NotFound'),
        links: allLinks,
    },
};

export const routesOrder: string[] = mapObjectToArray<RouteSetting, { key: string, order: number }>(
    routes,
    (route, key) => ({ key, order: route.order }),
)
    .sort((a, b) => a.order - b.order)
    .map(row => row.key);

export const views = mapObjectToObject<RouteSetting, (props: object) => JSX.Element>(
    routes,
    route => (props: object) => (
        <ViewManager
            {...props}
            load={route.loader}
        />
    ),
);

export const pathNames = mapObjectToObject<RouteSetting, string | undefined>(
    routes,
    route => route.path
);

export const validLinks = mapObjectToObject<RouteSetting, CloakSettings>(
    routes,
    route => route.links,
);

export const hideNavbar = mapObjectToObject<RouteSetting, boolean>(
    routes,
    route => !!route.hideNavbar,
);