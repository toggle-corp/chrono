import React, { PureComponent } from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import FormattedDate from '#rscv/FormattedDate';
import LoadingAnimation from '#rscv/LoadingAnimation';
import Confirm from '#rscv/Modal/Confirm';
import Table, { Header } from '#rscv/Table';
import {
    compareDate,
    compareString,
} from '#rsu/common';
import { RestRequest } from '#rsu/rest';

import {
    userGroupProjectsSelector,
    unsetUserGroupProjectAction,
} from '../../../redux';
import {
    RootState,
    Project,
    UnsetUserGroupProjectAction,
} from '../../../redux/interface';

import ProjectDeleteRequest from '../requests/ProjectDeleteRequest';

import ActionButtons from './ActionButtons';

import * as styles from './styles.scss';

interface OwnProps{}
interface PropsFromState {
    projects: Project[];
}
interface PropsFromDispatch {
    unsetProject(params: UnsetUserGroupProjectAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    showDeleteModal: boolean;
    pending: boolean;
    selectedRowIdForDelete?: number;
}

export class UserGroupProjects extends PureComponent<Props, States> {
    projectDeleteRequest: RestRequest;
    headers: Header<Project>[];

    static keySelector = (project: Project)  => project.id;

    constructor(props: Props) {
        super(props);

        this.state = {
            showDeleteModal: false,
            pending: false,
            selectedRowIdForDelete: undefined,
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
                key: 'createdAt',
                label: 'Created At',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareDate(a.createdAt, b.createdAt),
                modifier: row => (
                    <FormattedDate
                        value={row.createdAt}
                        mode="dd-MM-yyyy hh:mm"
                    />
                ),
            },
            {
                key: 'modifiedAt',
                label: 'Modified At',
                order: 3,
                sortable: true,
                comparator: (a, b) => compareDate(a.modifiedAt, b.modifiedAt),
                modifier: row => (
                    <FormattedDate
                        value={row.createdAt}
                        mode="dd-MM-yyyy hh:mm"
                    />
                ),
            },
            {
                key: 'createdByName',
                label: 'Created By',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareString(a.createdByName, b.createdByName),
            },
            {
                key: 'modifiedByName',
                label: 'Modified By',
                order: 5,
                sortable: true,
                comparator: (a, b) => compareString(a.modifiedByName, b.modifiedByName),
            },
            {
                key: 'action',
                label: 'Action',
                order: 6,
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

    startRequestForProjectDelete = (projectId: number) => {
        if (this.projectDeleteRequest) {
            this.projectDeleteRequest.stop();
        }

        const projectDeleteRequest = new ProjectDeleteRequest({
            unsetProject: this.props.unsetProject,
            setState: states => this.setState(states),
        });

        this.projectDeleteRequest = projectDeleteRequest.create({
            projectId,
        });
        this.projectDeleteRequest.start();
    }

    onRemove = (row: Project) => {
        this.setState({
            selectedRowIdForDelete: row.id,
            showDeleteModal: true,
        });
    }

    handleModalClose = (confirm: boolean) => {
        const { selectedRowIdForDelete } = this.state;
        if (selectedRowIdForDelete && confirm) {
            this.startRequestForProjectDelete(selectedRowIdForDelete);
        }
        this.setState({ showDeleteModal: false });
    }

    render() {
        const {
            showDeleteModal,
            pending,
        } = this.state;

        const { projects } = this.props;

        return (
            <div className={styles.projects}>
                {pending && <LoadingAnimation />}
                <Table
                    data={projects}
                    headers={this.headers}
                    keySelector={UserGroupProjects.keySelector}
                />
                <Confirm
                    show={showDeleteModal}
                    closeOnEscape
                    onClose={this.handleModalClose}
                >
                    <p>
                        Are you sure you want to delete the project ?
                    </p>
                </Confirm>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    projects: userGroupProjectsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    unsetProject: (params: UnsetUserGroupProjectAction) =>
        dispatch(unsetUserGroupProjectAction(params)),
});
export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(UserGroupProjects);
