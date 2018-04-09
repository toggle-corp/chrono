import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import {
    RootState,
    SetProjectAction,
    ActiveUser,
    UserGroup,
} from '../../../redux/interface';
import {
    FormErrors,
    FormFieldErrors,
    ValuesFromForm,
    Schema,
    PostProjectBody,
} from '../../../rest/interface';

import Form, {
    requiredCondition,
} from '../../../vendor/react-store/components/Input/Form';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';
import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';
import NonFieldErrors from '../../../vendor/react-store/components/Input/NonFieldErrors';
import TextInput from '../../../vendor/react-store/components/Input/TextInput';
import TextArea from '../../../vendor/react-store/components/Input/TextArea';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import DangerButton from '../../../vendor/react-store/components/Action/Button/DangerButton';
import { RestRequest } from '../../../vendor/react-store/utils/rest';

import {
    setProjectAction,
    activeUserSelector,
    userGroupsSelector,
    setUserGroupsAction,
} from '../../../redux';

import UserGroupsGetRequest from '../requests/UserGroupsGetRequest';
import ProjectPostRequest from '../requests/ProjectPostRequest';
import * as styles from './styles.scss';

interface OwnProps {
    handleClose() : void;
}
interface PropsFromState {
    activeUser: ActiveUser;
    userGroups: UserGroup[];
}
interface PropsFromDispatch {
    setProject(params: SetProjectAction): void;
    setUserGroups(params: UserGroup[]): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    formErrors: FormErrors;
    formFieldErrors: FormFieldErrors;
    formValues: ValuesFromForm;
    pristine: boolean;
    pending: boolean;
}

export class UserProjectAdd extends React.PureComponent<Props, States> {
    projectPostRequest: RestRequest;
    userGroupRequest: RestRequest;
    schema: Schema;

    static keySelector = (d: UserGroup) => d.id;
    static labelSelector = (d: UserGroup) => d.title;

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
                userGroup: [requiredCondition],
            },
        };
    }

    componentWillMount() {
        this.startRequestForUserGroup();
    }

    componentWillUnmount() {
        if (this.userGroupRequest) {
            this.userGroupRequest.stop();
        }
        if (this.projectPostRequest) {
            this.projectPostRequest.stop();
        }
    }

    startRequestForUserGroup = () => {
        if (this.userGroupRequest) {
            this.userGroupRequest.stop();
        }
        const request = new UserGroupsGetRequest({
            setUserGroups: this.props.setUserGroups,
            setState: params => this.setState(params),
        });
        this.userGroupRequest = request.create();
        this.userGroupRequest.start();
    }

    startRequestForProjectPost = (value: PostProjectBody) => {
        if (this.projectPostRequest) {
            this.projectPostRequest.stop();
        }
        const request = new ProjectPostRequest({
            userId: this.props.activeUser.userId,
            setProject: this.props.setProject,
            handleClose: this.props.handleClose,
            setState: v => this.setState(v),
        });
        this.projectPostRequest = request.create(value);
        this.projectPostRequest.start();
    }

    // FORM RELATED

    handleFormChange = (
        values: PostProjectBody, formFieldErrors: FormFieldErrors, formErrors: FormErrors,
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

    handleFormSubmit = (value: PostProjectBody) => {
        this.startRequestForProjectPost(value);
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
            userGroups,
        } = this.props;

        return (
            <Form
                className={styles.projectAddForm}
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
                <SelectInput
                    formname="userGroup"
                    className={styles.usergroup}
                    label="User Group"
                    options={userGroups}
                    placeholder="Select a user group"
                    keySelector={UserProjectAdd.keySelector}
                    labelSelector={UserProjectAdd.labelSelector}
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
                        Cancle
                    </DangerButton>
                </div>
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    activeUser: activeUserSelector(state),
    userGroups: userGroupsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setProject: (params: SetProjectAction) => dispatch(setProjectAction(params)),
    setUserGroups: (params: UserGroup[]) => dispatch(setUserGroupsAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(UserProjectAdd);
