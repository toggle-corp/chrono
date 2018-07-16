import React, {
    PureComponent,
} from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import {
    RootState,
    UserInformation,
    SetUserGroupMemberAction,
} from '../../../redux/interface';

import {
    setUserGroupMemberAction,
} from '../../../redux';

import Faram, {
    FaramErrors,
    FaramValues,
    FaramSchema,
} from '../../../vendor/react-store/components/Input/Faram';
import { requiredCondition } from '../../../vendor/react-store/components/Input/Faram/validations';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';
import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';
import NonFieldErrors from '../../../vendor/react-store/components/Input/NonFieldErrors';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import DangerButton from '../../../vendor/react-store/components/Action/Button/DangerButton';
import { RestRequest } from '../../../vendor/react-store/utils/rest';

import UsersGetRequest from '../requests/UsersGetRequest';
import AddMemberRequest from '../requests/AddMemberRequest';

import * as styles from './styles.scss';

interface OwnProps {
    userGroupId?: number;
    handleClose() : void;
}
interface PropsFromState {}
interface PropsFromDispatch {
    setMember(params: SetUserGroupMemberAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    faramErrors: FaramErrors;
    faramValues: FaramValues;
    pristine: boolean;
    pending: boolean;
    users: UserInformation[];
}

export class MemberAdd extends PureComponent<Props, States> {
    usersGetRequest: RestRequest;
    addUserRequest: RestRequest;
    userGroupMembersRequest: RestRequest;

    static keySelector = (d: UserInformation)  => d.id;
    static labelSelector = (d: UserInformation) => d.displayName;

    state = {
        faramErrors: {},
        faramValues: {},
        pending: false,
        pristine: true,
        users: [],
    };

    schema : FaramSchema = {
        fields: {
            userId: [requiredCondition],
        },
    };

    componentWillMount() {
        this.startRequestForUsers();
    }

    componentWillUnmount() {
        if (this.usersGetRequest) {
            this.usersGetRequest.stop();
        }
        if (this.addUserRequest) {
            this.addUserRequest.stop();
        }
    }

    startRequestForUsers = () => {
        if (this.usersGetRequest) {
            this.usersGetRequest.stop();
        }

        const request = new UsersGetRequest({
            setState: params => this.setState(params),
        });

        this.usersGetRequest = request.create();
        this.usersGetRequest.start();
    }

    startRequestAddUser = (values: FaramValues) => {
        if (this.addUserRequest) {
            this.addUserRequest.stop();
        }

        const { userGroupId } = this.props;
        if (!userGroupId) {
            return;
        }

        const member = {
            member: values.userId,
            role: 'normal',
            group: userGroupId,
        };

        const request = new AddMemberRequest({
            setMember: this.props.setMember,
            setState: params => this.setState(params),
            handleClose: this.props.handleClose,
        });

        this.addUserRequest = request.create(member);
        this.addUserRequest.start();
    }

    handleFaramChange = (values: FaramValues, faramErrors: FaramErrors) => {
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

    handleFaramSubmit = (values: FaramValues) => {
        this.startRequestAddUser(values);
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
        } = this.props;

        const {
            users,
        } = this.state;

        return (
            <Faram
                className={styles.memberAddForm}
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
                    faramElementName="userId"
                    label="User"
                    options={users}
                    placeholder="Select a user"
                    labelSelector={MemberAdd.labelSelector}
                    keySelector={MemberAdd.keySelector}
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
                        disabled={pending || pristine}
                    >
                        Save
                    </PrimaryButton>
                </div>
            </Faram>
        );
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setMember: (params: SetUserGroupMemberAction) => dispatch(setUserGroupMemberAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    undefined, mapDispatchToProps,
)(MemberAdd);