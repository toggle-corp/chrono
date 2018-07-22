import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import RestRequest from '../../vendor/react-store/utils/rest/RestRequest.js';
import Table  from '../../vendor/react-store/components/View/Table';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';

import {
    RootState,
    Project as ProjectInterface,
    Task,
    SetProjectAction,
    SetProjectTasksAction,
} from '../../redux/interface';
import {
    projectIdFromRouteSelector,
    projectSelector,
    projectTasksSelector,
    setProjectAction,
    setProjectTasksAction,
} from '../../redux';

import AddTask from '../../components/AddTask';

import headers from './headers';
import GetProjectRequest from './requests/GetProjectRequest';
import GetTasksRequest from './requests/GetTasksRequest';

// import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    projectId?: number;
    project?: ProjectInterface;
    tasks: Task[];
}
interface PropsFromDispatch {
    setProject(params: SetProjectAction): void;
    setProjectTasks(params: SetProjectTasksAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States{
    loadingProject: boolean;
    loadingTasks: boolean;
}

const keyExtractor = (t: Task) => t.id;

export class Project extends React.PureComponent<Props, States> {
    projectRequest: RestRequest;
    tasksRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            loadingProject: true,
            loadingTasks: true,
        };
    }

    componentWillMount() {
        this.startRequestForProject(this.props.projectId);
        this.startRequestForTasks(this.props.projectId);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.projectId !== nextProps.projectId) {
            this.startRequestForProject(nextProps.projectId);
            this.startRequestForTasks(this.props.projectId);
        }
    }

    componentWillUnmount() {
        if (this.projectRequest) {
            this.projectRequest.stop();
        }
    }

    startRequestForProject = (projectId?: number) => {
        if (!projectId) {
            return;
        }
        if (this.projectRequest) {
            this.projectRequest.stop();
        }
        const projectRequest = new GetProjectRequest({
            setState: params => this.setState(params),
            setProject: this.props.setProject,
        });
        this.projectRequest = projectRequest.create(projectId);
        this.projectRequest.start();
    }

    startRequestForTasks = (projectId?: number) => {
        if (!projectId) {
            return;
        }
        if (this.tasksRequest) {
            this.tasksRequest.stop();
        }
        const tasksRequest = new GetTasksRequest({
            setState: params => this.setState(params),
            setProjectTasks: this.props.setProjectTasks,
        });
        this.tasksRequest = tasksRequest.create(projectId);
        this.tasksRequest.start();
    }

    reloadTasks = () => {
        this.startRequestForTasks(this.props.projectId);
    }

    render() {
        const {
            projectId,
            project,
            tasks,
        } = this.props;

        if (!project || !projectId) {
            return <div />;
        }

        const {
            loadingProject,
            loadingTasks,
        } = this.state;

        const loading = loadingProject || loadingTasks;

        return (
            <div>
                {loading && <LoadingAnimation />}
                <p>{project.title}</p>
                <p>{project.description}</p>
                <AddTask
                    projectId={projectId}
                    disabledProjectChange
                    disabled={loading}
                    onTaskCreate={this.reloadTasks}
                />
                <Table
                    data={tasks}
                    headers={headers}
                    keyExtractor={keyExtractor}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    projectId: projectIdFromRouteSelector(state),
    project: projectSelector(state),
    tasks: projectTasksSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setProject: (params: SetProjectAction) => dispatch(setProjectAction(params)),
    setProjectTasks: (params: SetProjectTasksAction) => dispatch(setProjectTasksAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Project);
