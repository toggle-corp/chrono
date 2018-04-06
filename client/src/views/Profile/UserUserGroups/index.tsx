import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import {
    compareString,
} from '../../../vendor/react-store/utils/common';
import Table from '../../../vendor/react-store/components/View/Table';
import Confirm from '../../../vendor/react-store/components/View/Modal/Confirm';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';

import { RestRequest } from '../../../vendor/react-store/utils/rest';
import {
    RootState,
    UserUserGroup,
    UnsetUserUserGroupAction,
    UserIdFromRoute,
} from '../../../redux/interface';
import {
    userUserGroupsSelector,
    unsetUserUserGroupAction,
    userIdFromRoute,
} from '../../../redux';

import UserGroupDeleteRequest from '../requests/UserGroupDeleteRequest';
import ActionButtons from './ActionButtons';

import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    userId: UserIdFromRoute;
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
    headers: object[];

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
                comparator: (a: UserUserGroup, b: UserUserGroup) => compareString(a.title, b.title),
            },
            {
                key: 'role',
                label: 'Role',
                order: 2,
                sortable: true,
                comparator: (a: UserUserGroup, b: UserUserGroup) => compareString(a.role, b.role),
            },
            {
                key: 'action',
                label: 'Action',
                order: 3,
                sortable: false,
                modifier: (row: UserUserGroup) => (
                    <ActionButtons
                        row={row}
                        onRemove={this.onRemove}
                    />
                ),
            },
        ];
    }

    startRequestForUserGroupDelete = (row: UserUserGroup) => {
        if (this.userGroupDeleteRequest) {
            this.userGroupDeleteRequest.stop();
        }
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

    keyExtractor = (userGroup: UserUserGroup) => userGroup.id;

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
                    keyExtractor={this.keyExtractor}
                />
                <Confirm
                    show={showDeleteModal}
                    closeOnEscape
                    onClose={this.handleDeleteModalClose}
                >
                    <p>
                        Are you sure ?
                    </p>
                </Confirm>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    userId: userIdFromRoute(state),
    userGroups: userUserGroupsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    unsetUserGroup: (params: UnsetUserUserGroupAction) =>
        dispatch(unsetUserUserGroupAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(UserUserGroups);
