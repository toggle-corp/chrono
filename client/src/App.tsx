import * as React from 'react';
import * as Redux from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { RestRequest, FgRestBuilder } from '#rsu/rest';
import { RootState, Token } from './redux/interface';
import {
    authenticatedSelector,
    tokenSelector,
    setAccessTokenAction,
} from './redux';
import { startTasksAction } from './redux/middlewares/taskManager';
import {
    createParamsForTokenRefresh,
    urlForTokenRefresh,
} from './rest';
import schema from './schema';
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
type Props = OwnProps & PropsFromState & PropsFromDispatch;

// NOTE: Refreshes user if user is already logged in
export class App extends React.PureComponent<Props, State> {
    refreshRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        // pending must be true only if user is already authenticated
        this.state = { pending: this.props.authenticated };
    }

    componentDidMount() {
        if (this.props.authenticated) {
            this.refreshRequest = this.createRequestForRefresh();
            this.refreshRequest.start();
        }
    }

    componentWillUnmount() {
        if (this.refreshRequest) {
            this.refreshRequest.stop();
        }
    }

    createRequestForRefresh = () => {
        // NOTE: at this point refresh must be defined
        const { refresh = '' } = this.props.token;
        const refreshRequest = new FgRestBuilder()
            .url(urlForTokenRefresh)
            .params(() => createParamsForTokenRefresh({ refresh }))
            .success((response: { access: string }) => {
                try {
                    schema.validate(response, 'tokenRefreshResponse');

                    this.props.startTasks();

                    const { access } = response;
                    this.props.setAccessToken(access);

                    this.setState({ pending: false });
                } catch (er) {
                    console.error(er);
                }
            })
            .build();
        return refreshRequest;
    }

    render() {
        if (this.props.authenticated && this.state.pending) {
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
)(App);
