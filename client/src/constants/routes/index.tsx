import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

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
        path: '/login/',
        loader: () => import('../../views/Login'),
        links: noLinks,
        hideNavbar: true,
        name: 'Login',
    },

    register: {
        order: 2,
        type: ROUTE.exclusivelyPublic,
        redirectTo: '/',
        path: '/register/',
        loader: () => import('../../views/Register'),
        links: noLinks,
        hideNavbar: true,
        name: 'Register',
    },

    workspace: {
        order: 3,
        type: ROUTE.private,
        path: '/',
        loader: () => import('../../views/Workspace'),
        links: allLinks,
        name: 'Workspace',
    },

    profile: {
        order: 4,
        type: ROUTE.private,
        path: '/profile/:userId/',
        loader: () => import('../../views/Profile'),
        links: allLinks,
        name: 'Profile',
    },

    userGroup: {
        order: 5,
        type: ROUTE.private,
        path: '/user-group/:userGroupId/',
        loader: () => import('../../views/UserGroups'),
        links: allLinks,
        name: 'User Group',
    },

    project: {
        order: 6,
        type: ROUTE.private,
        path: '/project/:projectId/',
        // TODO: create project view
        loader: () => import('../../views/Dashboard'),
        links: allLinks,
        name: 'Project',
    },

    dashboard: {
        order: 7,
        type: ROUTE.private,
        path: '/dashboard/',
        loader: () => import('../../views/Dashboard'),
        links: allLinks,
        name: 'Dashboard',
    },

    // NOTE: 404 page should always be at the end
    notFound: {
        order: 8,
        type: ROUTE.public,
        path: undefined,
        loader: () => import('../../views/NotFound'),
        links: allLinks,
        name: '404',
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
    route => (props: RouteComponentProps<{}>) => (
        <ViewManager
            {...props}
            load={route.loader}
            name={route.name}
        />
    ),
);

export const pathNames = mapObjectToObject<RouteSetting, string | undefined>(
    routes,
    route => route.path,
);

export const validLinks = mapObjectToObject<RouteSetting, CloakSettings>(
    routes,
    route => route.links,
);

export const hideNavbar = mapObjectToObject<RouteSetting, boolean>(
    routes,
    route => !!route.hideNavbar,
);
