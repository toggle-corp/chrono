/**
 * @author frozenhelium <fren.ankit@gmail.com>
 */

import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
    FgRestBuilder,
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
} from '../../rest';
import {
    loginAction,
    authenticateAction,
} from '../../redux';
import { startRefreshAction } from '../../redux/middlewares/refresher';
import pathNames from '../../common/constants/pathNames';
import schema from '../../schema';

import styles from './styles.scss';

const propTypes = {
    authenticate: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    startRefresh: PropTypes.func.isRequired,
};

const defaultProps = {
};

const mapDispatchToProps = dispatch => ({
    authenticate: () => dispatch(authenticateAction()),
    login: params => dispatch(loginAction(params)),
    startRefresh: params => dispatch(startRefreshAction(params)),
});

@connect(undefined, mapDispatchToProps)
@CSSModules(styles, { allowMultiple: true })
export default class Login extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            formErrors: [],
            formFieldErrors: {},
            formValues: {},
            pending: false,
            pristine: false,

            uploadedFiles: [],
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
    changeCallback = (values, { formErrors, formFieldErrors }) => {
        this.setState({
            formValues: { ...this.state.formValues, ...values },
            formFieldErrors: { ...this.state.formFieldErrors, ...formFieldErrors },
            formErrors,
            pristine: true,
        });
    };

    failureCallback = ({ formErrors, formFieldErrors }) => {
        this.setState({
            formFieldErrors: { ...this.state.formFieldErrors, ...formFieldErrors },
            formErrors,
        });
    };

    successCallback = ({ email, password }) => {
        const url = urlForTokenCreate;
        const params = createParamsForTokenCreate({
            username: email,
            password,
        });
        this.login({ url, params });
    };

    // LOGIN ACTION

    login = ({ url, params }) => {
        // Stop any retry action
        if (this.userLoginRequest) {
            this.userLoginRequest.stop();
        }
        this.userLoginRequest = this.createRequestLogin(url, params);

        this.userLoginRequest.start();
    };

    // LOGIN REST API

    createRequestLogin = (url, params) => {
        const userLoginRequest = new FgRestBuilder()
            .url(url)
            .params(params)
            .preLoad(() => {
                this.setState({ pending: true, pristine: false });
            })
            .success((response) => {
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
            .failure((response) => {
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
            .fatal((response) => {
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
            <div styleName="login">
                <div styleName="chrono-container">
                    <h2 styleName="heading">
                        <small>Welcome To Chrono</small><br />
                    </h2>
                </div>
                <div styleName="login-form-container">
                    <Form
                        styleName="login-form"
                        changeCallback={this.changeCallback}
                        elements={this.elements}
                        failureCallback={this.failureCallback}
                        successCallback={this.successCallback}
                        validations={this.validations}
                        value={formValues}
                        error={formFieldErrors}
                    >
                        { pending && <LoadingAnimation /> }
                        <NonFieldErrors errors={formErrors} />
                        <TextInput
                            disabled={pending}
                            formname="email"
                            label="Email"
                            // FIXME: use strings
                            placeholder="john.doe@mail.com"
                            autoFocus
                        />
                        <TextInput
                            disabled={pending}
                            formname="password"
                            label="Password"
                            // FIXME: use strings
                            placeholder="**********"
                            required
                            type="password"
                        />
                        <div styleName="action-buttons">
                            <PrimaryButton disabled={pending}>
                                Login
                            </PrimaryButton>
                        </div>
                    </Form>
                    <div styleName="register-link-container">
                        <p>No Account Yet ?</p>
                        <Link
                            styleName="register-link"
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
