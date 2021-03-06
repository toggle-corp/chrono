import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import {
    RootState,
    SetProjectAction,
    ActiveUser,
    UserGroup,
} from '../../redux/interface';
import {
    PostProjectBody,
} from '../../rest/interface';

import Faram, {
    FaramErrors,
    FaramValues,
    FaramSchema,
} from '#rscg/Faram';
import { requiredCondition } from '#rscg/Faram/validations';
import LoadingAnimation from '#rscv/LoadingAnimation';
import SelectInput from '#rsci/SelectInput';
import NonFieldErrors from '#rsci/NonFieldErrors';
import TextInput from '#rsci/TextInput';
import TextArea from '#rsci/TextArea';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';
import { RestRequest } from '#rsu/rest';

import {
    setProjectAction,
    activeUserSelector,
    userGroupsSelector,
    setUserGroupsAction,
} from '../../redux';

import UserGroupsGetRequest from './requests/UserGroupsGetRequest';
import ProjectPostRequest from './requests/ProjectPostRequest';
import * as styles from './styles.scss';

interface OwnProps {
    handleClose() : void;
    userGroupId?: number;
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
    faramErrors: FaramErrors;
    faramValues: FaramValues;
    pristine: boolean;
    pending: boolean;
}

export class AddProject extends React.PureComponent<Props, States> {
    projectPostRequest: RestRequest;
    userGroupRequest: RestRequest;
    schema: FaramSchema;

    static keySelector = (d: UserGroup) => d.id;
    static labelSelector = (d: UserGroup) => d.title;

    constructor(props: Props) {
        super(props);

        this.state = {
            faramErrors: {},
            faramValues: { userGroup: props.userGroupId },
            pending: false,
            pristine: true,
        };

        this.schema = {
            fields: {
                title: [requiredCondition],
                userGroup: [requiredCondition],
                description: [],
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

    handleFaramChange = (
        values: PostProjectBody, faramErrors: FaramErrors,
    ) => {
        this.setState({
            faramErrors,
            faramValues: values,
            pristine: false,
        });
    }

    handleFaramError = (faramErrors: FaramErrors) => {
        this.setState({
            faramErrors,
            pristine: false,
        });
    }

    handleFaramSubmit = (value: PostProjectBody) => {
        this.startRequestForProjectPost(value);
    }

    render() {
        const {
            faramErrors,
            faramValues,
            pending,
            pristine,
        } = this.state;

        const {
            handleClose,
            userGroups,
            userGroupId,
        } = this.props;

        return (
            <Faram
                className={styles.projectAddForm}
                schema={this.schema}
                value={faramValues}
                error={faramErrors}
                onChange={this.handleFaramChange}
                onValidationSuccess={this.handleFaramSubmit}
                onValidationFailure={this.handleFaramError}
                disabled={pending}
            >
                {pending && <LoadingAnimation />}
                <NonFieldErrors faramElement />
                <SelectInput
                    faramElementName="userGroup"
                    label="User Group"
                    options={userGroups}
                    placeholder="Select a user group"
                    keySelector={AddProject.keySelector}
                    labelSelector={AddProject.labelSelector}
                    disabled={!!userGroupId}
                />
                <TextInput
                    faramElementName="title"
                    label="Title"
                    autoFocus
                />
                <TextArea
                    faramElementName="description"
                    label="Description"
                    rows={3}
                />
                <div className={styles.actionButtons}>
                    <DangerButton
                        className={styles.actionButton}
                        onClick={handleClose}
                        disabled={pending}
                    >
                        Cancel
                    </DangerButton>
                    <PrimaryButton
                        className={styles.actionButton}
                        type="submit"
                        disabled={pristine || pending}
                    >
                        Add
                    </PrimaryButton>
                </div>
            </Faram>
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
)(AddProject);
