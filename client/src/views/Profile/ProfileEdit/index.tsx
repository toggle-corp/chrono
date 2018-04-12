import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import {
    RootState,
    UserInformation,
    SetUserAction,
} from '../../../redux/interface';
import {
    FormErrors,
    FormFieldErrors,
    ValuesFromForm,
    Schema,
    PatchUserBody,
} from '../../../rest/interface';

import Form, {
    requiredCondition,
} from '../../../vendor/react-store/components/Input/Form';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';
import NonFieldErrors from '../../../vendor/react-store/components/Input/NonFieldErrors';
import TextInput from '../../../vendor/react-store/components/Input/TextInput';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import DangerButton from '../../../vendor/react-store/components/Action/Button/DangerButton';
import { RestRequest } from '../../../vendor/react-store/utils/rest';

import {
    userIdFromRouteSelector,
    userInformationSelector,
    setUserAction,
} from '../../../redux';

import UserPatchRequest from '../requests/UserPatchRequest';
import * as styles from './styles.scss';

interface OwnProps {
    handleClose() : void;
}
interface PropsFromState {
    userId?: number;
    information?: UserInformation;
}
interface PropsFromDispatch {
    setUser(params: SetUserAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    formErrors: FormErrors;
    formFieldErrors: FormFieldErrors;
    formValues: ValuesFromForm;
    pristine: boolean;
    pending: boolean;
}

export class ProfileEdit extends React.PureComponent<Props, States> {
    userPatchRequest: RestRequest;
    schema: Schema;

    constructor(props: Props) {
        super(props);

        this.state = {
            formErrors: {},
            formFieldErrors: {},
            formValues: props.information  || {},
            pending: false,
            pristine: false,
        };

        this.schema = {
            fields: {
                firstName: [requiredCondition],
                lastName: [requiredCondition],
            },
        };
    }

    componentWillUnmount() {
        if (this.userPatchRequest) {
            this.userPatchRequest.stop();
        }
    }

    startRequestForUserPatch = (userId: number, value: PatchUserBody) => {
        if (this.userPatchRequest) {
            this.userPatchRequest.stop();
        }
        const request = new UserPatchRequest({
            userId,
            setUser: this.props.setUser,
            handleClose: this.props.handleClose,
            setState: v => this.setState(v),
        });
        this.userPatchRequest = request.create(value);
        this.userPatchRequest.start();
    }

    // FORM RELATED

    handleFormChange = (
        values: PatchUserBody, formFieldErrors: FormFieldErrors, formErrors: FormErrors,
    ) => {
        this.setState({
            formErrors,
            formFieldErrors,
            formValues: values,
            pristine: true,
        });
    }

    handleFormError = (formFieldErrors: FormFieldErrors, formErrors: FormErrors) => {
        this.setState({
            formErrors,
            formFieldErrors,
            pristine: true,
        });
    }

    handleFormSubmit = (value: PatchUserBody) => {
        const { userId } = this.props;
        if (userId) {
            this.startRequestForUserPatch(userId, value);
        }
    }

    render() {
        const {
            formErrors,
            formFieldErrors,
            formValues,
            pending,
            pristine,
        } = this.state;

        const {
            handleClose,
        } = this.props;

        return (
            <Form
                className={styles.profileEditForm}
                schema={this.schema}
                value={formValues}
                formErrors={formErrors}
                fieldErrors={formFieldErrors}
                changeCallback={this.handleFormChange}
                successCallback={this.handleFormSubmit}
                failureCallback={this.handleFormError}
                disabled={pending}
            >
                {pending && <LoadingAnimation />}
                <NonFieldErrors formerror="" />
                <TextInput
                    formname="firstName"
                    label="First Name"
                    placeholder=""
                    autoFocus
                />
                <TextInput
                    formname="lastName"
                    label="Last Name"
                    placeholder=""
                    autoFocus
                />
                <div className={styles.actionButtons}>
                    <PrimaryButton
                        type="submit"
                        disabled={!pristine || pending}
                    >
                        Update
                    </PrimaryButton>
                    <DangerButton
                        onClick={handleClose}
                    >
                        Cancle
                    </DangerButton>
                </div>
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    information: userInformationSelector(state),
    userId: userIdFromRouteSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setUser: (params: SetUserAction) => dispatch(setUserAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(ProfileEdit);
