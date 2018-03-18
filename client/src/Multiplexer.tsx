import React, { Fragment } from 'react';
import {
    Switch,
    Route,
    withRouter,
    RouteComponentProps,
} from 'react-router-dom';
import { connect } from 'react-redux';

import Navbar from './components/Navbar';
import ViewManager from './components/ViewManager';
import PrivateRoute from './vendor/react-store/components/General/PrivateRoute';
import ExclusivelyPublicRoute from './vendor/react-store/components/General/ExclusivelyPublicRoute';

import pathNames from './constants/pathNames';

import { RootState } from './redux/interface';
import { authenticatedSelector } from './redux';
// import views from './views';

enum ROUTE {
    exclusivelyPublic = 'exclusively-public',
    public = 'public',
    private = 'private',
}

const routes: {
    [key: string]: {
        type: string;
        redirectTo?: string;
    };
} = {
    login: {
        type: ROUTE.exclusivelyPublic,
        redirectTo: '/',
    },
    workspace: { type: ROUTE.public },
    notFound: { type: ROUTE.public },
};

const routesOrder: string[] = [
    'login',
    'workspace',
    'notFound',
];

const loaders = {
    login: () => import('./views/Login'),
    workspace: () => import('./views/Workspace'),
    notFound: () => import('./views/NotFound'),
};

const views = {};
Object.keys(loaders).forEach((key) => {
    const loader = loaders[key]; // tslint:disable-line no-any

    views[key] = (props: object) => (
        <ViewManager
            {...props}
            load={loader}
        />
    );
});

interface OwnProps extends RouteComponentProps<{}> {}
interface PropsFromDispatch {}
interface PropsFromState {
    authenticated: boolean;
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

class Multiplexer extends React.PureComponent<Props, {}> {
    renderRoute = (routeId: string): (JSX.Element|null) => {
        const path = pathNames[routeId];

        const viewComponent = views[routeId];
        if (!viewComponent) {
            console.error(`View not associated with ${routeId}`);
            return null;
        }

        const { authenticated } = this.props;

        const route = routes[routeId];
        const redirectTo = route.redirectTo;
        const routeType = route.type;

        switch (routeType) {
            case ROUTE.exclusivelyPublic:
                return (
                    <ExclusivelyPublicRoute
                        component={viewComponent}
                        key={routeId}
                        path={path}
                        exact={true}

                        authenticated={authenticated}
                        redirectLink={redirectTo}
                    />
                );
            case ROUTE.private:
                return (
                    <PrivateRoute
                        component={viewComponent}
                        key={routeId}
                        path={path}
                        exact={true}

                        authenticated={authenticated}
                        redirectLink={redirectTo}
                    />
                );
            case ROUTE.public:
                return (
                    <Route
                        component={viewComponent}
                        key={routeId}
                        path={path}
                        exact={true}
                    />
                );
            default:
                console.error(`Invalid route type ${routes[routeId].type}`);
                return null;
        }
    }

    render() {
        return (
            <Fragment>
                <Navbar
                    className="navbar"
                />
                <div className="chrono-main-content">
                    <Switch>
                        {routesOrder.map((routeId) => this.renderRoute(routeId))}
                    </Switch>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    authenticated: authenticatedSelector(state),
});

export default withRouter(
    connect<PropsFromState, PropsFromDispatch, OwnProps>(mapStateToProps)(Multiplexer)
);

/*
<div className={styles.timeline}>
    <div className={styles.statusBar}/>
        <div className={styles.dateSelector} />
        <div className={styles.timeIndicator} />
    </div>
    {
        days.map((day) => (
            <div className={styles.row}>
                <div className={styles.dayIndicator} />
                <div className={styles.timeslots} />
            </div>
        ))
    }
</div>
*/
