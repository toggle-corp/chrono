import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { reverseRoute } from '../../vendor/react-store/utils/common';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import NonFieldErrors from '../../vendor/react-store/components/Input/NonFieldErrors';
import TextInput from '../../vendor/react-store/components/Input/TextInput';
import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton';
import { RestRequest } from '../../vendor/react-store/utils/rest';
import Faram, {
    emailCondition,
    lengthGreaterThanCondition,
    requiredCondition,
} from '../../vendor/react-store/components/Input/Faram';

import {
    FaramErrors,
    FaramValues,
    Schema,
} from '../../rest/interface';
import { startTasksAction } from '../../redux/middlewares/taskManager';
import {
    authenticateAction,
    loginAction,
} from '../../redux';
import { RootState, Token } from '../../redux/interface';
import { pathNames } from '../../constants';

import CreateTokenRequest from './requests/CreateTokenRequest';
import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState { }
interface PropsFromDispatch {
    authenticate(): void;
    login(params: Token): void;
    startTasks(): void;
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    faramErrors: FaramErrors;
    faramValues: FaramValues;
    pending: boolean;
    pristine: boolean;
}

interface AuthParams {
    email: string;
    password: string;
}

export class Login extends React.PureComponent<Props, States> {
    userLoginRequest: RestRequest;
    schema: Schema;

    constructor(props: Props) {
        super(props);

        this.state = {
            faramErrors: {},
            faramValues: {},
            pending: false,
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

    componentWillUnmount() {
        if (this.userLoginRequest) {
            this.userLoginRequest.stop();
        }
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
        if (this.userLoginRequest) {
            this.userLoginRequest.stop();
        }

        const request = new CreateTokenRequest({
            login: this.props.login,
            authenticate: this.props.authenticate,
            setState: v => this.setState(v),
            startTasks: this.props.startTasks,
        });
        this.userLoginRequest = request.create(value);
        this.userLoginRequest.start();
    }

    render() {
        const {
            faramValues,
            faramErrors,
            pending,
        } = this.state;

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
)(Login);
