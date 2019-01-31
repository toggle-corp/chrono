import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { reverseRoute } from '#rsu/common';
import LoadingAnimation from '#rscv/LoadingAnimation';
import NonFieldErrors from '#rsci/NonFieldErrors';
import TextInput from '#rsci/TextInput';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import Faram, {
    FaramErrors,
    FaramValues,
    FaramSchema,
} from '#rscg/Faram';
import {
    emailCondition,
    lengthGreaterThanCondition,
    requiredCondition,
} from '#rscg/Faram/validations';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '../../request';
import { startTasksAction } from '../../redux/middlewares/taskManager';
import {
    authenticateAction,
    loginAction,
} from '../../redux';
import { RootState, Token } from '../../redux/interface';
import { pathNames } from '../../constants';

import * as styles from './styles.scss';

interface AuthParams {
    email: string;
    password: string;
}

interface States {
    faramErrors: FaramErrors;
    faramValues: FaramValues;
    // pending: boolean;
    pristine: boolean;
}

interface OwnProps {}
interface PropsFromState { }
interface PropsFromDispatch {
    authenticate(): void;
    login(params: Token): void;
    startTasks(): void;
}
type ReduxProps = OwnProps & PropsFromState & PropsFromDispatch;

type Params = {
    value: AuthParams,
    setError(error: FaramErrors): void,
};

type Props = NewProps<ReduxProps, Params>;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    loginRequest: {
        url: '/token/',
        method: methods.POST,
        body: ({ params }) => {
            if (params) {
                const {
                    value: {
                        password,
                        email,
                    },
                } = params;
                return { password, username: email };
            }
            return undefined;
        },
        onSuccess: ({ props, params, response }) => {
            const { refresh, access } = response as { access: string, refresh: string };
            props.login({ refresh, access });
            props.startTasks();
            props.authenticate();
        },
        onFailure: ({ error, params }) => {
            const { faramErrors } = error as { faramErrors: FaramErrors };
            params && params.setError(faramErrors);
        },
        onFatal: ({ params }) => {
            params && params.setError({
                $internal: ['Some error occured.'],
            });
        },
    },
};

export class Login extends React.PureComponent<Props, States> {
    schema: FaramSchema;

    constructor(props: Props) {
        super(props);

        this.state = {
            faramErrors: {},
            faramValues: {},
            // pending: false,
            pristine: true,
        };

        this.schema = {
            fields: {
                email: [
                    requiredCondition,
                    emailCondition,
                ],
                password: [
                    requiredCondition,
                    lengthGreaterThanCondition(4),
                ],
            },
        };
    }

    handleFaramChange = (
        faramValues: AuthParams, faramErrors: FaramErrors,
    ) => {
        this.setState({
            faramValues,
            faramErrors,
            pristine: false,
        });
    }

    handleFaramFailure = (faramErrors: FaramErrors) => {
        this.setState({
            faramErrors,
            pristine: false,
        });
    }

    handleFaramSuccess = (value: AuthParams) => {
        /*
        const request = new CreateTokenRequest({
            login: this.props.login,
            authenticate: this.props.authenticate,
            setState: v => this.setState(v),
            startTasks: this.props.startTasks,
        });
        */
        const { loginRequest } = this.props.requests;
        loginRequest.do({ value, setError: this.handleFaramFailure });
    }

    render() {
        const {
            faramValues,
            faramErrors,
        } = this.state;
        const { loginRequest: { pending } } = this.props.requests;

        return (
            <div className={styles.login}>
                <div className={styles.chronoContainer}>
                    <h1 className={styles.heading}>
                        Chrono
                    </h1>
                </div>
                <div className={styles.loginFormContainer}>
                    <Faram
                        className={styles.loginForm}
                        schema={this.schema}
                        disabled={pending}
                        value={faramValues}
                        error={faramErrors}
                        onChange={this.handleFaramChange}
                        onValidationSuccess={this.handleFaramSuccess}
                        onValidationFailure={this.handleFaramFailure}
                    >
                        {pending && <LoadingAnimation />}
                        <NonFieldErrors faramElement />
                        <TextInput
                            faramElementName="email"
                            label="Email"
                            placeholder="john.doe@mail.com"
                            autoFocus
                        />
                        <TextInput
                            faramElementName="password"
                            label="Password"
                            placeholder="****"
                            type="password"
                        />
                        <div className={styles.actionButtons}>
                            <PrimaryButton type="submit">
                                Login
                            </PrimaryButton>
                        </div>
                    </Faram>
                    <div className={styles.registerLinkContainer}>
                        <p>
                            No account yet ?
                        </p>
                        <Link
                            className={styles.registerLink}
                            to={reverseRoute(pathNames.register, {})}
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    authenticate: () => dispatch(authenticateAction()),
    login: (params: Token) => dispatch(loginAction(params)),
    startTasks: () => dispatch(startTasksAction()),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    undefined, mapDispatchToProps,
)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(Login),
    ),
);
