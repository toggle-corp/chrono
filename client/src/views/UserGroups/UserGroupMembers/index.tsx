import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Redux from 'redux';

import FormattedDate from '../../../vendor/react-store/components/View/FormattedDate';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';
import Confirm from '../../../vendor/react-store/components/View/Modal/Confirm';
import Table, { Header } from '../../../vendor/react-store/components/View/Table';
import {
    compareDate,
    compareString,
} from '../../../vendor/react-store/utils/common';
import { RestRequest } from '../../../vendor/react-store/utils/rest';

import {
    Member,
    RootState,
    UnsetUserGroupMemberAction,
} from '../../../redux/interface';
import {
    unsetUserGroupMemberAction,
    userGroupIdFromRouteSelector,
    userGroupMembersSelector,
} from '../../../redux';

import MemberDeleteRequest from '../requests/MemberDeleteRequest';

import ActionButtons from './ActionButtons';
import styles from './styles.scss';

interface OwnProps{}
interface PropsFromState{
    members: Member[];
    userGroupId?: number;
}
interface PropsFromDispatch {
    unsetMember(params: UnsetUserGroupMemberAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    pending: boolean;
    selectedMemberIdForDelete?: number;
    showDeleteModal: boolean;
}

export class UserGroupMembers extends PureComponent<Props, States> {
    memberDeleteRequest: RestRequest;
    headers: Header<Member>[];

    static keyExtractor = (member: Member) => member.id;

    constructor(props: Props) {
        super(props);

        this.state  = {
            pending: false,
            selectedMemberIdForDelete: undefined,
            showDeleteModal: false,
        };

        this.headers = [
            {
                key: 'memberName',
                label: 'Name',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.memberName, b.memberName),
            },
            {
                key: 'memberEmail',
                label: 'Email',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.memberEmail, b.memberEmail),
            },
            {
                key: 'role',
                label: 'Role',
                order: 3,
                sortable: true,
                comparator: (a, b) => compareString(a.role, b.role),
            },
            {
                key: 'joinedAt',
                label: 'Joined At',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareDate(a.joinedAt, b.joinedAt),
                modifier: row => (
                    <FormattedDate
                        date={row.joinedAt}
                        mode="dd-MM-yyyy"
                    />
                ),
            },
            {
                key: 'action',
                label: 'Action',
                order: 5,
                sortable: false,
                modifier: row => (
                    <ActionButtons
                        row={row}
                        onRemove={this.onRemove}
                    />
                ),
            },
        ];
    }

    componentWillUnmount() {
        if (this.memberDeleteRequest) {
            this.memberDeleteRequest.stop();
        }
    }

    startRequestForMemberDelete = (memberId: number) => {
        if (this.memberDeleteRequest) {
            this.memberDeleteRequest.stop();
        }
        const { userGroupId } = this.props;

        if (!userGroupId) {
            return;
        }
        const memberDeleteRequest = new MemberDeleteRequest({
            unsetMember: this.props.unsetMember,
            setState: states => this.setState(states),
        });

        this.memberDeleteRequest = memberDeleteRequest.create({
            userGroupId,
            memberId,
        });
        this.memberDeleteRequest.start();
    }

    onRemove = (row: Member) => {
        this.setState({
            selectedMemberIdForDelete: row.id,
            showDeleteModal: true,
        });
    }

    handleDeleteModalClose = (confirm: boolean) => {
        const { selectedMemberIdForDelete } = this.state;

        if (selectedMemberIdForDelete && confirm) {
            this.startRequestForMemberDelete(selectedMemberIdForDelete);
        }
        this.setState({ showDeleteModal: false });
    }

    render() {
        const {
            showDeleteModal,
            pending,
        } = this.state;

        const {
            members,
        } = this.props;

        return (
            <div className={styles.members}>
                {pending && <LoadingAnimation />}
                <Table
                    data={members}
                    headers={this.headers}
                    keyExtractor={UserGroupMembers.keyExtractor}
                />
                <Confirm
                    show={showDeleteModal}
                    closeOnEscape
                    onClose={this.handleDeleteModalClose}
                >
                    <p>
                        Are you sure you want to delete this member?
                    </p>
                </Confirm>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    userGroupId: userGroupIdFromRouteSelector(state),
    members: userGroupMembersSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    unsetMember: (params: UnsetUserGroupMemberAction) =>
        dispatch(unsetUserGroupMemberAction(params)),
});
export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(UserGroupMembers);
