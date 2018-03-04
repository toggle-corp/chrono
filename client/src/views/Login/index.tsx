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
import Form, {
    emailCondition,
    lengthGreaterThanCondition,
    requiredCondition,
} from '../../vendor/react-store/components/Input/Form';

import {
    ErrorsFromForm,
    FormErrors,
    FormFieldErrors,
    FormValidationRules,
    ValuesFromForm,
} from '../../rest/interface';
import {
    authenticateAction,
    loginAction,
} from '../../redux';
import { RootState, Token } from '../../redux/interface';
import { pathNames } from '../../constants';

import CreateTokenRequest from './requests/CreateTokenRequest';
import styles from './styles.scss';

interface OwnProps {}
interface PropsFromDispatch {
    authenticate(): void;
    login(params: Token): void;
}
interface PropsFromState {
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    formErrors: FormErrors;
    formFieldErrors: FormFieldErrors;
    formValues: ValuesFromForm;
    pending: boolean;
    pristine: boolean;
}

interface AuthParams {
    email: string;
    password: string;
}

class Login extends React.PureComponent<Props, States> {
    elements: string[];
    userLoginRequest: RestRequest;
    validations: FormValidationRules;

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
        values: ValuesFromForm,
        { formErrors, formFieldErrors }: ErrorsFromForm
    ) => {
        this.setState({
            formErrors,
            formFieldErrors: { ...this.state.formFieldErrors, ...formFieldErrors },
            formValues: { ...this.state.formValues, ...values },
            pristine: true,
        });
    }

    failureCallback = (
        { formErrors, formFieldErrors }: ErrorsFromForm
    ) => {
        this.setState({
            formErrors,
            formFieldErrors: { ...this.state.formFieldErrors, ...formFieldErrors },
        });
    }

    // LOGIN ACTION on successCallback
    successCallback = (
        value: AuthParams
    ) => {
        // Stop any retry action
        if (this.userLoginRequest) {
            this.userLoginRequest.stop();
        }
        const request = new CreateTokenRequest(
            this,
            {
                login: this.props.login,
                authenticate: this.props.authenticate,
            }
        );
        this.userLoginRequest = request.create(value);
        this.userLoginRequest.start();
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
                        <small>
                            Welcome To Chrono
                        </small>
                        <br />
                    </h2>
                </div>
                <div className={styles.loginFormContainer}>
                    <Form
                        className={styles.loginForm}
                        elements={this.elements}
                        validations={this.validations}
                        value={formValues}
                        error={formFieldErrors}
                        changeCallback={this.changeCallback}
                        successCallback={this.successCallback}
                        failureCallback={this.failureCallback}
                        disabled={pending}
                    >
                        {pending && <LoadingAnimation />}
                        <NonFieldErrors errors={formErrors} />
                        <TextInput
                            formname="email"
                            label="Email"
                            placeholder="john.doe@mail.com"
                            autoFocus
                        />
                        <TextInput
                            formname="password"
                            label="Password"
                            placeholder="**********"
                            required
                            type="password"
                        />
                        <div className={styles.actionButtons}>
                            <PrimaryButton>
                                Login
                            </PrimaryButton>
                        </div>
                    </Form>
                    <div className={styles.registerLinkContainer}>
                        <p>
                            No Account Yet ?
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
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(undefined, mapDispatchToProps)(Login);
