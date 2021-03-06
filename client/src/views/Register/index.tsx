import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { reverseRoute } from '#rsu/common';
import LoadingAnimation from '#rscv/LoadingAnimation';
import NonFieldErrors from '#rsci/NonFieldErrors';
import TextInput from '#rsci/TextInput';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import { RestRequest } from '#rsu/rest';
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

import { pathNames } from '../../constants';

import UserRegisterRequest, { RegisterParams } from './requests/UserRegisterRequest';
import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState { }

type Props = OwnProps & PropsFromState;

interface States {
    faramErrors: FaramErrors;
    faramValues: FaramValues;
    pending: boolean;
    pristine: boolean;
    success: boolean;
}

export class Register extends React.PureComponent<Props, States> {
    userRegisterRequest: RestRequest;
    schema: FaramSchema;

    constructor(props: Props) {
        super(props);

        this.state = {
            faramErrors: {},
            faramValues: {},
            pending: false,
            pristine: false,
            success: false,
        };

        this.schema = {
            fields: {
                firstName: [requiredCondition],
                lastName: [requiredCondition],
                username: [
                    requiredCondition,
                    emailCondition,
                ],
                password: [
                    requiredCondition,
                    lengthGreaterThanCondition(4),
                ],
                confirmPassword: [
                    requiredCondition,
                    lengthGreaterThanCondition(4),
                ],
            },
            validation: ({ password, confirmPassword }) => {
                const errors = [];
                if (password !== confirmPassword) {
                    errors.push('Passwords do not match');
                }
                return errors;
            },
        };
    }

    componentWillUnmount() {
        if (this.userRegisterRequest) {
            this.userRegisterRequest.stop();
        }
    }

    handleFaramChange = (
        faramValues: RegisterParams, faramErrors: FaramErrors,
    ) => {
        this.setState({
            faramValues,
            faramErrors,
            pristine: true,
        });
    }

    handleFaramFailure = (faramErrors: FaramErrors) => {
        this.setState({
            faramErrors,
            pristine: true,
        });
    }

    handleFaramSuccess = (value: RegisterParams) => {
        if (this.userRegisterRequest) {
            this.userRegisterRequest.stop();
        }
        const userRegisterRequest = new UserRegisterRequest({
            setState: v => this.setState(v),
        });
        this.userRegisterRequest = userRegisterRequest.create(value);
        this.userRegisterRequest.start();
    }

    render() {
        const {
            faramValues,
            faramErrors,
            pending,
            success,
        } = this.state;

        return (
            <div className={styles.register}>
                <div className={styles.chronoContainer}>
                    <h1 className={styles.heading}>
                        Chrono
                    </h1>
                </div>
                <div className={styles.registerFormContainer}>
                    {
                        success ? (
                            <div className={styles.registerSuccess}>
                                <p>
                                    User is registered successfully.
                                    Please login to continue.
                                </p>
                            </div>
                        ) : (
                            <Faram
                                className={styles.registerForm}
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
                                    faramElementName="firstName"
                                    label="First Name"
                                    placeholder="John"
                                    autoFocus
                                />
                                <TextInput
                                    faramElementName="lastName"
                                    label="Last Name"
                                    placeholder="Doe"
                                />
                                <TextInput
                                    faramElementName="username"
                                    label="Email"
                                    placeholder="john.doe@mail.com"
                                />
                                <TextInput
                                    faramElementName="password"
                                    label="Password"
                                    placeholder="****"
                                    type="password"
                                />
                                <TextInput
                                    faramElementName="confirmPassword"
                                    label="Confirm Password"
                                    placeholder="****"
                                    type="password"
                                />
                                <div className={styles.actionButtons}>
                                    <PrimaryButton type="submit">
                                        Register
                                    </PrimaryButton>
                                </div>
                            </Faram>
                        )
                    }
                    <div className={styles.loginLinkContainer}>
                        <p>
                            Already have a account ?
                        </p>
                        <Link
                            className={styles.loginLink}
                            to={reverseRoute(pathNames.login, {})}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect<PropsFromState>(undefined)(Register);
