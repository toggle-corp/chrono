import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import {
    compareString,
} from '#rsu/common';
import Table, { Header } from '#rscv/Table';
import Confirm from '#rscv/Modal/Confirm';
import LoadingAnimation from '#rscv/LoadingAnimation';

import { RestRequest } from '#rsu/rest';

import {
    RootState,
    UserUserGroup,
    UnsetUserUserGroupAction,
} from '../../../redux/interface';
import {
    userUserGroupsSelector,
    unsetUserUserGroupAction,
    userIdFromRouteSelector,
} from '../../../redux';

import UserGroupDeleteRequest from '../requests/UserGroupDeleteRequest';
import ActionButtons from './ActionButtons';

import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    userId?: number;
    userGroups: UserUserGroup[];
}
interface PropsFromDispatch {
    unsetUserGroup: (params: UnsetUserUserGroupAction) => void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    showDeleteModal: boolean;
    pending: boolean;
    selectedRowForDelete?: UserUserGroup;
}

export class UserUserGroups extends React.PureComponent<Props, States> {
    userGroupDeleteRequest: RestRequest;
    headers: Header<UserUserGroup>[];

    constructor(props: Props) {
        super(props);

        this.state = {
            showDeleteModal: false,
            pending: false,
            selectedRowForDelete: undefined,
        };

        this.headers = [
            {
                key: 'title',
                label: 'Title',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.title, b.title),
            },
            {
                key: 'role',
                label: 'Role',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.role, b.role),
            },
            {
                key: 'action',
                label: 'Action',
                order: 3,
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
        if (this.userGroupDeleteRequest) {
            this.userGroupDeleteRequest.stop();
        }
    }

    startRequestForUserGroupDelete = (row: UserUserGroup) => {
        if (this.userGroupDeleteRequest) {
            this.userGroupDeleteRequest.stop();
        }
        if (this.props.userId) {
            const userGroupDeleteRequest = new UserGroupDeleteRequest({
                unsetUserGroup: this.props.unsetUserGroup,
                setState: states => this.setState(states),
            });
            this.userGroupDeleteRequest = userGroupDeleteRequest.create({
                userId: this.props.userId,
                userGroup: row,
            });
            this.userGroupDeleteRequest.start();
        }
    }

    onRemove = (row: UserUserGroup) => {
        this.setState({
            selectedRowForDelete: row,
            showDeleteModal: true,
        });
    }

    handleDeleteModalClose = (confirm: boolean) => {
        const { selectedRowForDelete } = this.state;
        if (selectedRowForDelete && confirm) {
            this.startRequestForUserGroupDelete(selectedRowForDelete);
        }
        this.setState({ showDeleteModal: false });
    }

    keySelector = (userGroup: UserUserGroup) => userGroup.id;

    render() {
        const {
            showDeleteModal,
            pending,
        } = this.state;
        const {
            userGroups,
        } = this.props;

        return (
            <div className={styles.userGroups}>
                {pending && <LoadingAnimation />}
                <Table
                    data={userGroups}
                    headers={this.headers}
                    keySelector={this.keySelector}
                />
                <Confirm
                    show={showDeleteModal}
                    closeOnEscape
                    onClose={this.handleDeleteModalClose}
                >
                    <p>
                        Are you sure you want to delete this user group?
                    </p>
                </Confirm>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    userId: userIdFromRouteSelector(state),
    userGroups: userUserGroupsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    unsetUserGroup: (params: UnsetUserUserGroupAction) =>
        dispatch(unsetUserUserGroupAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(UserUserGroups);
