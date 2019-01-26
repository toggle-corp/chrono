import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { compareString } from '#rsu/common';
import Table, { Header } from '#rscv/Table';
import Confirm from '#rscv/Modal/Confirm';
import LoadingAnimation from '#rscv/LoadingAnimation';

import { RestRequest } from '#rsu/rest';

import {
    RootState,
    UserProject,
    UnsetUserProjectAction,
} from '../../../redux/interface';
import {
    userProjectsSelector,
    unsetUserProjectAction,
    userIdFromRouteSelector,
} from '../../../redux';

import ProjectDeleteRequest from '../requests/ProjectDeleteRequest';
import ActionButtons from './ActionButtons';

import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    userId?: number;
    projects: UserProject[];
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
    headers: Header<UserProject>[];

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
        if (this.projectDeleteRequest) {
            this.projectDeleteRequest.stop();
        }
    }

    startRequestForProjectDelete = (row: UserProject) => {
        if (this.projectDeleteRequest) {
            this.projectDeleteRequest.stop();
        }
        if (this.props.userId) {
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

    keySelector = (project: UserProject) => project.id;

    render() {
        const {
            showDeleteModal,
            pending,
        } = this.state;
        const {
            projects,
        } = this.props;

        return (
            <div className={styles.projects}>
                {pending && <LoadingAnimation />}
                <Table
                    data={projects}
                    headers={this.headers}
                    keySelector={this.keySelector}
                />
                <Confirm
                    show={showDeleteModal}
                    closeOnEscape
                    onClose={this.handleDeleteModalClose}
                >
                    <p>
                        Are you sure you want to delete this project?
                    </p>
                </Confirm>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    userId: userIdFromRouteSelector(state),
    projects: userProjectsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    unsetProject: (params: UnsetUserProjectAction) =>
        dispatch(unsetUserProjectAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(UserProjects);
