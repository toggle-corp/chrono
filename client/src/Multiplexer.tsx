import React, { Fragment } from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import {
    Switch,
    Route,
    withRouter,
    RouteComponentProps,
} from 'react-router-dom';

import PrivateRoute from '#rscg/PrivateRoute';
import ExclusivelyPublicRoute from '#rscg/ExclusivelyPublicRoute';
import Toast from '#rscv/Toast';

import {
    authenticatedSelector,
    lastNotifySelector,
    notifyHideAction,
} from './redux';
import { pathNames, views, routes, routesOrder } from './constants';

import Navbar from './components/Navbar';

import { RootState, Notification } from './redux/interface';
import { ROUTE } from './constants/routes/interface';

interface OwnProps extends RouteComponentProps<{}> {}
interface PropsFromDispatch {
    notifyHide(): void;
}
interface PropsFromState {
    authenticated: boolean;
    lastNotify: Notification;
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

// NOTE: switches to correct route, adds navbar and notification
class Multiplexer extends React.PureComponent<Props, {}> {

    handleToastClose = () => {
        this.props.notifyHide();
    }

    renderRoute = (routeId: string): (JSX.Element|null) => {
        const path = pathNames[routeId];

        const viewComponent = views[routeId];
        if (!viewComponent) {
            console.error(`View not found for routeId '${routeId}'`);
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
                console.error(`Invalid route type '${routes[routeId].type}'`);
                return null;
        }
    }

    render() {
        const { lastNotify } = this.props;

        return (
            <Fragment>
                <Navbar className="navbar" />
                <Toast
                    notification={lastNotify}
                    onClose={this.handleToastClose}
                />
                <div className="chrono-main-content">
                    <Switch>
                        {routesOrder.map(routeId => this.renderRoute(routeId))}
                    </Switch>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    authenticated: authenticatedSelector(state),
    lastNotify: lastNotifySelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    notifyHide: () => dispatch(notifyHideAction()),
});

export default withRouter(
    connect<PropsFromState, PropsFromDispatch, OwnProps>(
        mapStateToProps,
        mapDispatchToProps,
    )(Multiplexer),
);
