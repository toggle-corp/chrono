/**
 * @author frozenhelium <fren.ankit@gmail.com>
 */

import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
    FgRestBuilder,
    RestRequest,
} from '../../vendor/react-store/utils/rest';
import { reverseRoute } from '../../vendor/react-store/utils/common';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import NonFieldErrors from '../../vendor/react-store/components/Input/NonFieldErrors';
import TextInput from '../../vendor/react-store/components/Input/TextInput';
import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton';
import Form, {
    requiredCondition,
    emailCondition,
    lengthGreaterThanCondition,
} from '../../vendor/react-store/components/Input/Form';

import {
    transformResponseErrorToFormError,
    createParamsForTokenCreate,
    urlForTokenCreate,
    ErrorsIp,
} from '../../rest';
import {
    loginAction,
    authenticateAction,
} from '../../redux';
import { startRefreshAction } from '../../redux/middlewares/refresher';
import { pathNames } from '../../constants';
import schema from '../../schema';
import { RootState } from '../..//redux/interface';

import styles from './styles.scss';

interface LoginParams {
    refresh: string;
    access: string;
}

type formValue= any; // tslint:disable-line no-any
type formError= any; // tslint:disable-line no-any
type formFieldError= any; // tslint:disable-line no-any

interface FormValue {
    [key: string]: formValue;
}

interface FormFieldErrors {
    [key: string]: formFieldError;
}

interface ValidationRule {
    message: string;
    truth(value: formValue): boolean;
}

interface Validations {
    [key: string]: ValidationRule[];
}

interface RequestParams {
    email: string;
    password: string;
}

interface RequestResponse {
    errors: ErrorsIp;
    refresh: string;
    access: string;
}

interface OwnProps {}
interface PropsFromDispatch {
    authenticate(): void;
    login(params: LoginParams): void;
    startRefresh(): void;
}
interface PropsFromState {
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    pristine: boolean;
    pending: boolean;
    formValues: FormValue;
    formErrors: formError[];
    formFieldErrors: FormFieldErrors;
}

const defaultProps = {};

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    authenticate: () => dispatch(authenticateAction()),
    login: (params: LoginParams) => dispatch(loginAction(params)),
    startRefresh: () => dispatch(startRefreshAction()),
});

class Login extends React.PureComponent<Props, States> {
    static defaultProps = defaultProps;

    elements: string[];
    validations: Validations;
    userLoginRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            formErrors: [],
            formFieldErrors: {},
            formValues: {},
            pending: false,
            pristine: false,
        };

        // Data for form elements
        this.elements = ['email', 'password'];

        this.validations = {
            email: [
                requiredCondition,
                emailCondition,
            ],
            password: [
                requiredCondition,
                lengthGreaterThanCondition(4),
            ],
        };
    }

    componentWillUnmount() {
        if (this.userLoginRequest) {
            this.userLoginRequest.stop();
        }
    }

    // FORM RELATED
    changeCallback = (
        values: FormValue,
        { formErrors, formFieldErrors }: { formErrors: formError[], formFieldErrors: FormFieldErrors}
    ) => {
        this.setState({
            formValues: { ...this.state.formValues, ...values },
            formFieldErrors: { ...this.state.formFieldErrors, ...formFieldErrors },
            formErrors,
            pristine: true,
        });
    }

    failureCallback = (
        { formErrors, formFieldErrors }: { formErrors: formError[], formFieldErrors: FormFieldErrors }
    ) => {
        this.setState({
            formFieldErrors: { ...this.state.formFieldErrors, ...formFieldErrors },
            formErrors,
        });
    }

    // LOGIN ACTION on successCallback
    successCallback = ({ email, password }: RequestParams) => {
        // Stop any retry action
        if (this.userLoginRequest) {
            this.userLoginRequest.stop();
        }
        this.userLoginRequest = this.createRequestLogin({ email, password });
        this.userLoginRequest.start();
    }

    // LOGIN REST API
    createRequestLogin = ({ email, password }: RequestParams) => {
        const userLoginRequest = new FgRestBuilder()
            .url(urlForTokenCreate)
            .params(createParamsForTokenCreate({
                username: email,
                password,
            }))
            .preLoad(() => {
                this.setState({ pending: true, pristine: false });
            })
            .success((response: RequestResponse) => {
                try {
                    schema.validate(response, 'tokenGetResponse');
                    const { refresh, access } = response;
                    this.props.login({ refresh, access });

                    // after setAccessToken, current user is verified
                    this.props.startRefresh();
                    this.props.authenticate();
                    this.setState({ pending: false });
                } catch (err) {
                    console.error(err);
                }
            })
            .failure((response: RequestResponse) => {
                console.info('FAILURE:', response);
                const {
                    formFieldErrors,
                    formErrors,
                } = transformResponseErrorToFormError(response.errors);
                this.setState({
                    formFieldErrors,
                    formErrors,
                    pending: false,
                });
            })
            .fatal((response: object) => {
                console.info('FATAL:', response);
                this.setState({
                    formErrors: ['Error while trying to log in.'],
                    pending: false,
                });
            })
            .build();
        return userLoginRequest;
    }

    render() {
        const {
            formErrors = [],
            formFieldErrors,
            formValues,
            pending,
        } = this.state;

        return (
            <div className={styles.login}>
                <div className={styles.chronoContainer}>
                    <h2 className={styles.heading}>
                        <small>Welcome To Chrono</small><br />
                    </h2>
                </div>
                <div className={styles.loginFormContainer}>
                    <Form
                        className={styles.loginForm}
                        changeCallback={this.changeCallback}
                        elements={this.elements}
                        failureCallback={this.failureCallback}
                        successCallback={this.successCallback}
                        validations={this.validations}
                        value={formValues}
                        error={formFieldErrors}
                    >
                        {pending && <LoadingAnimation />}
                        <NonFieldErrors errors={formErrors} />
                        <TextInput
                            disabled={pending}
                            formname="email"
                            label="Email"
                            placeholder="john.doe@mail.com"
                            autoFocus
                        />
                        <TextInput
                            disabled={pending}
                            formname="password"
                            label="Password"
                            placeholder="**********"
                            required
                            type="password"
                        />
                        <div className={styles.actionButtons}>
                            <PrimaryButton disabled={pending}>
                                Login
                            </PrimaryButton>
                        </div>
                    </Form>
                    <div className={styles.registerLinkContainer}>
                        <p>No Account Yet ?</p>
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

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(undefined, mapDispatchToProps)(Login);
