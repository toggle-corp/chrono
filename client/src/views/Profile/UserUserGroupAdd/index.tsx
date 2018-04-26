import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import {
    RootState,
    SetUserGroupAction,
    ActiveUser,
} from '../../../redux/interface';
import {
    FormErrors,
    FormFieldErrors,
    ValuesFromForm,
    Schema,
    PostUserGroupBody,
} from '../../../rest/interface';

import Form, {
    requiredCondition,
} from '../../../vendor/react-store/components/Input/Form';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';
import NonFieldErrors from '../../../vendor/react-store/components/Input/NonFieldErrors';
import TextInput from '../../../vendor/react-store/components/Input/TextInput';
import TextArea from '../../../vendor/react-store/components/Input/TextArea';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import DangerButton from '../../../vendor/react-store/components/Action/Button/DangerButton';
import { RestRequest } from '../../../vendor/react-store/utils/rest';

import {
    setUserGroupAction,
    activeUserSelector,
} from '../../../redux';

import UserGroupPostRequest from '../requests/UserGroupPostRequest';
import * as styles from './styles.scss';

interface OwnProps {
    handleClose() : void;
}
interface PropsFromState {
    activeUser: ActiveUser;
}
interface PropsFromDispatch {
    setUserGroup(params: SetUserGroupAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    formErrors: FormErrors;
    formFieldErrors: FormFieldErrors;
    formValues: ValuesFromForm;
    pristine: boolean;
    pending: boolean;
}

export class UserUserGroupAdd extends React.PureComponent<Props, States> {
    userGroupPostRequest: RestRequest;
    schema: Schema;

    constructor(props: Props) {
        super(props);

        this.state = {
            formErrors: {},
            formFieldErrors: {},
            formValues: {},
            pending: false,
            pristine: false,
        };

        this.schema = {
            fields: {
                title: [requiredCondition],
                description: [],
            },
        };
    }

    componentWillUnmount() {
        if (this.userGroupPostRequest) {
            this.userGroupPostRequest.stop();
        }
    }

    startRequestForUserGroupPost = (value: PostUserGroupBody) => {
        if (this.userGroupPostRequest) {
            this.userGroupPostRequest.stop();
        }
        const request = new UserGroupPostRequest({
            userId: this.props.activeUser.userId,
            setUserGroup: this.props.setUserGroup,
            handleClose: this.props.handleClose,
            setState: v => this.setState(v),
        });
        this.userGroupPostRequest = request.create(value);
        this.userGroupPostRequest.start();
    }

    // FORM RELATED

    handleFormChange = (
        values: PostUserGroupBody, formFieldErrors: FormFieldErrors, formErrors: FormErrors,
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

    handleFormSubmit = (value: PostUserGroupBody) => {
        this.startRequestForUserGroupPost(value);
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
                className={styles.userGroupAddForm}
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
                    formname="title"
                    label="Title"
                    placeholder=""
                    autoFocus
                />
                <TextArea
                    formname="description"
                    label="Description"
                    placeholder=""
                    rows={3}
                />
                <div className={styles.actionButtons}>
                    <PrimaryButton
                        type="submit"
                        disabled={!pristine || pending}
                    >
                        Add
                    </PrimaryButton>
                    <DangerButton
                        onClick={handleClose}
                    >
                        Cancel
                    </DangerButton>
                </div>
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    activeUser: activeUserSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setUserGroup: (params: SetUserGroupAction) => dispatch(setUserGroupAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(UserUserGroupAdd);
