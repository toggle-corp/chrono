import React, { Fragment } from 'react';
import {
    Switch,
    Route,
    withRouter,
    RouteComponentProps,
} from 'react-router-dom';
import { connect } from 'react-redux';

import Navbar from './components/Navbar';
import PrivateRoute from './vendor/react-store/components/General/PrivateRoute';
import ExclusivelyPublicRoute from './vendor/react-store/components/General/ExclusivelyPublicRoute';

import { RootState } from './redux/interface';
import { authenticatedSelector } from './redux';
import { pathNames, views, routes, routesOrder } from './constants';
import { ROUTE } from './constants/routes/interface';

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
        const { redirectTo, type: routeType } = route;

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
                <Navbar className="navbar" />
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
