import React, {
    PureComponent,
} from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import {
    compareString,
    compareDate,
} from '../../../vendor/react-store/utils/common';
import Table from '../../../vendor/react-store/components/View/Table';
import Confirm from '../../../vendor/react-store/components/View/Modal/Confirm';
import FormattedDate from '../../../vendor/react-store/components/View/FormattedDate';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';

import { RestRequest } from '../../../vendor/react-store/utils/rest';

import {
    RootState,
    Project,
    UnsetUserGroupProjectAction,
} from '../../../redux/interface';
import {
    userGroupProjectsSelector,
    unsetUserGroupProjectAction,
} from '../../../redux';

import ActionButtons from './ActionButtons';

import * as styles from './styles.scss';
import ProjectDeleteRequest from '../requests/ProjectDeleteRequest';

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
    headers: object[];

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
                comparator: (a: Project, b: Project) =>
                    compareString(a.title, b.title),
            },
            {
                key: 'createdAt',
                label: 'Created At',
                order: 2,
                sortable: true,
                comparator: (a: Project, b: Project) =>
                    compareDate(a.createdAt, b.createdAt),
                modifier: (row: Project) => (
                    <FormattedDate
                        date={row.createdAt}
                        mode="dd-MM-yyyy hh:mm"
                    />
                ),
            },
            {
                key: 'modifiedAt',
                lable: 'Modified At',
                order: 3,
                sortable: true,
                comparator: (a: Project, b: Project) =>
                    compareDate(a.modifiedAt, b.modifiedAt),
                modifier: (row: Project) => (
                    <FormattedDate
                        date={row.createdAt}
                        mode="dd-MM-yyyy hh:mm"
                    />
                ),
            },
            {
                key: 'createdByName',
                label: 'Created By',
                order: 4,
                sortable: true,
                comparator: (a: Project, b: Project) =>
                    compareString(a.createdByName, b.createdByName),
            },
            {
                key: 'modifiedByName',
                label: 'Modified By',
                order: 5,
                sortable: true,
                comparator: (a: Project, b: Project) =>
                    compareString(a.modifiedByName, b.modifiedByName),
            },
            {
                key: 'action',
                label: 'Action',
                order: 6,
                sortable: false,
                modifier: (row: Project) => (
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

    keyExtractor = (project: Project)  => project.id;

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
                    keyExtractor={this.keyExtractor}
                />
                <Confirm
                    show={showDeleteModal}
                    closeOnEscape
                    onClose={this.handleModalClose}
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
    projects: userGroupProjectsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    unsetProject: (params: UnsetUserGroupProjectAction) =>
        dispatch(unsetUserGroupProjectAction(params)),
});
export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(UserGroupProjects);
