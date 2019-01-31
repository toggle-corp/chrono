import * as React from 'react';
import * as Redux from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
} from './request';
import { RootState, Token } from './redux/interface';
import {
    authenticatedSelector,
    tokenSelector,
    setAccessTokenAction,
} from './redux';
import { startTasksAction } from './redux/middlewares/taskManager';
import Multiplexer from './Multiplexer';

interface OwnProps {}
interface PropsFromDispatch {
    setAccessToken(access: string): void;
    startTasks(): void;
}
interface State {
    pending: boolean;
}
interface PropsFromState {
    authenticated: boolean;
    token: Token;
}
type ReduxProps = OwnProps & PropsFromState & PropsFromDispatch;

type Params = {
    refresh: string | undefined,
    setPending(value: boolean): void;
};

type Props = NewProps<ReduxProps, Params>;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    refreshRequest: {
        url: '/token/refresh/',
        method: 'POST',
        onMount: ({ props }) => props.authenticated,
        body: ({ params }) => ({
            refresh: params ? params.refresh : undefined,
        }),
        extras: {
            schemaName: 'tokenRefreshResponse',
        },
        onSuccess: ({ props, response, params }) => {
            props.startTasks();
            const { access } = response as { access: string };
            props.setAccessToken(access);

            if (params) {
                params.setPending(false);
            }
        },
    },
};

// NOTE: Refreshes user if user is already logged in
export class App extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        const {
            authenticated,
            token: { refresh },
            requests: { refreshRequest },
        } = this.props;

        // NOTE: pending must be true only if user is already authenticated
        this.state = {
            pending: authenticated,
        };

        if (refreshRequest) {
            refreshRequest.setDefaultParams({
                refresh,
                setPending: this.setPending,
            });
        }
    }

    setPending = (val: boolean) => {
        this.setState({ pending: val });
    }

    render() {
        const { authenticated } = this.props;
        const { pending } = this.state;

        if (authenticated && pending) {
            return (
                <div className="full-screen-message">
                    We have found your previous session...
                </div>
            );
        }

        return (
            <BrowserRouter>
                <Multiplexer />
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    authenticated: authenticatedSelector(state),
    token: tokenSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setAccessToken: (access: string) => dispatch(setAccessTokenAction(access)),
    startTasks: () => dispatch(startTasksAction()),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(App),
    ),
);
