import React, {
    PureComponent,
} from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import {
    RootState,
    SetUsersAction,
    UserPartialInformation,
    SetUserGroupMemberAction,
} from '../../../redux/interface';

import {
    setUsersAction,
    usersSelector,
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
interface PropsFromState {
    users: UserPartialInformation[];
}
interface PropsFromDispatch {
    setUsers(params: SetUsersAction): void;
    setMember(params: SetUserGroupMemberAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    faramErrors: FaramErrors;
    faramValues: FaramValues;
    pristine: boolean;
    pending: boolean;
}

export class MemberAdd extends PureComponent<Props, States> {
    usersGetRequest: RestRequest;
    addUserRequest: RestRequest;
    userGroupMembersRequest: RestRequest;

    static keySelector = (d: UserPartialInformation)  => d.id;
    static labelSelector = (d: UserPartialInformation) => d.displayName;

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
            setUsers: this.props.setUsers,
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
            users,
            handleClose,
        } = this.props;

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

const mapStateToProps = (state: RootState) => ({
    users: usersSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setUsers: (params: SetUsersAction) => dispatch(setUsersAction(params)),
    setMember: (params: SetUserGroupMemberAction) => dispatch(setUserGroupMemberAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(MemberAdd);
