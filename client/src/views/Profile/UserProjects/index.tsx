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
    UserProject,
    UnsetUserProjectAction,
    UserIdFromRoute,
} from '../../../redux/interface';
import {
    userProjectsSelector,
    unsetUserProjectAction,
    userIdFromRoute,
} from '../../../redux';

import ProjectDeleteRequest from '../requests/ProjectDeleteRequest';
import ActionButtons from './ActionButtons';

import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    userId: UserIdFromRoute;
    Projects: UserProject[];
}
interface PropsFromDispatch {
    unsetProject: (params: UnsetUserProjectAction) => void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    showDeleteModal: boolean;
    pending: boolean;
    selectedRowForDelete?: UserProject;
}

export class UserProjects extends React.PureComponent<Props, States> {
    projectDeleteRequest: RestRequest;
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
                comparator: (a: UserProject, b: UserProject) => compareString(a.title, b.title),
            },
            {
                key: 'role',
                label: 'Role',
                order: 2,
                sortable: true,
                comparator: (a: UserProject, b: UserProject) => compareString(a.role, b.role),
            },
            {
                key: 'action',
                label: 'Action',
                order: 3,
                sortable: false,
                modifier: (row: UserProject) => (
                    <ActionButtons
                        row={row}
                        onRemove={this.onRemove}
                    />
                ),
            },
        ];
    }

    componentWillUnmount() {
        if (this.projectDeleteRequest) {
            this.projectDeleteRequest.stop();
        }
    }

    startRequestForProjectDelete = (row: UserProject) => {
        if (this.projectDeleteRequest) {
            this.projectDeleteRequest.stop();
        }
        const projectDeleteRequest = new ProjectDeleteRequest({
            unsetProject: this.props.unsetProject,
            setState: states => this.setState(states),
        });
        this.projectDeleteRequest = projectDeleteRequest.create({
            userId: this.props.userId,
            project: row,
        });
        this.projectDeleteRequest.start();
    }

    onRemove = (row: UserProject) => {
        this.setState({
            selectedRowForDelete: row,
            showDeleteModal: true,
        });
    }

    handleDeleteModalClose = (confirm: boolean) => {
        const { selectedRowForDelete } = this.state;
        if (selectedRowForDelete && confirm) {
            this.startRequestForProjectDelete(selectedRowForDelete);
        }
        this.setState({ showDeleteModal: false });
    }

    keyExtractor = (project: UserProject) => project.id;

    render() {
        const {
            showDeleteModal,
            pending,
        } = this.state;
        const {
            Projects,
        } = this.props;

        return (
            <div className={styles.projects}>
                {pending && <LoadingAnimation />}
                <Table
                    data={Projects}
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
    Projects: userProjectsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    unsetProject: (params: UnsetUserProjectAction) =>
        dispatch(unsetUserProjectAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(UserProjects);
