import React from 'react';
import {
    Switch,
    Route,
} from 'react-router-dom';

import PrivateRoute, {
    ExclusivelyPublicRoute,
} from './public/components/General/PrivateRoute';

import pathNames from './common/constants/pathNames';
import views from './views';

const ROUTE = {
    exclusivelyPublic: 'exclusively-public',
    public: 'public',
    private: 'private',
};

const routesOrder = [
    // 'landing',
    // 'login',
    // 'register',

    // 'team',
    'workspace',
];

const routes = {
    login: {
        type: ROUTE.exclusivelyPublic,
        redirectTo: '/',
    },
    register: {
        type: ROUTE.exclusivelyPublic,
        redirectTo: '/',
    },

    landing: { type: ROUTE.exclusivelyPublic },
    workspace: { type: ROUTE.private },
    team: { type: ROUTE.private },
};

export default class Multiplexer extends React.PureComponent {
    getRoutes = () => (
        routesOrder.map((routeId) => {
            const view = views[routeId];
            const path = pathNames[routeId];
            const authenticated = true;

            if (!view) {
                console.error(`Cannot find view associated with routeID: ${routeId}`);
                return null;
            }
            const redirectTo = routes[routeId].redirectTo;

            switch (routes[routeId].type) {
                case ROUTE.exclusivelyPublic:
                    return (
                        <ExclusivelyPublicRoute
                            component={view}
                            key={routeId}
                            path={path}
                            authenticated={authenticated}
                            redirectLink={redirectTo}
                            exact
                        />
                    );
                case ROUTE.private:
                    return (
                        <PrivateRoute
                            component={view}
                            key={routeId}
                            path={path}
                            authenticated={authenticated}
                            redirectLink={redirectTo}
                            exact
                        />
                    );
                case ROUTE.public:
                    return (
                        <Route
                            component={view}
                            key={routeId}
                            path={path}
                            exact
                        />
                    );
                default:
                    console.error(`Invalid route type ${routes[routeId].type}`);
                    return null;
            }
        })
    )

    render() {
        return (
            <div className="main-content">
                <Switch>
                    { this.getRoutes() }
                </Switch>
            </div>
        );
    }
}
