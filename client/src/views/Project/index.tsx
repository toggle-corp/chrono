import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import RestRequest from '#rsu/rest/RestRequest.js';
import Table  from '#rscv/Table';
import LoadingAnimation from '#rscv/LoadingAnimation';

import {
    RootState,
    Project as ProjectInterface,
    Task,
    Tag,
    SetProjectAction,
    SetProjectTasksAction,
    SetProjectTagsAction,
} from '../../redux/interface';
import {
    projectIdFromRouteSelector,
    projectSelector,
    projectTasksSelector,
    projectTagsSelector,
    setProjectAction,
    setProjectTasksAction,
    setProjectTagsAction,
} from '../../redux';

import AddTask from '../../components/AddTask';
import AddTag from '../../components/AddTag';

import {
    tagHeaders,
    taskHeaders,
} from './headers';
import GetProjectRequest from './requests/GetProjectRequest';
import GetTasksRequest from './requests/GetTasksRequest';
import GetTagsRequest from './requests/GetTagsRequest';

// import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    projectId?: number;
    project?: ProjectInterface;
    tasks: Task[];
    tags: Tag[];
}
interface PropsFromDispatch {
    setProject(params: SetProjectAction): void;
    setProjectTasks(params: SetProjectTasksAction): void;
    setProjectTags(params: SetProjectTagsAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States{
    loadingProject: boolean;
    loadingTasks: boolean;
    loadingTags: boolean;
}

const keyExtractor = (t: Task | Tag) => t.id;

export class Project extends React.PureComponent<Props, States> {
    projectRequest: RestRequest;
    tasksRequest: RestRequest;
    tagsRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            loadingProject: true,
            loadingTasks: true,
            loadingTags: true,
        };
    }

    componentWillMount() {
        this.startRequestForProject(this.props.projectId);
        this.startRequestForTasks(this.props.projectId);
        this.startRequestForTags(this.props.projectId);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.projectId !== nextProps.projectId) {
            this.startRequestForProject(nextProps.projectId);
            this.startRequestForTasks(this.props.projectId);
            this.startRequestForTags(this.props.projectId);
        }
    }

    componentWillUnmount() {
        if (this.projectRequest) {
            this.projectRequest.stop();
        }
        if (this.tasksRequest) {
            this.tasksRequest.stop();
        }
        if (this.tagsRequest) {
            this.tagsRequest.stop();
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

    startRequestForTags = (projectId?: number) => {
        if (!projectId) {
            return;
        }
        if (this.tagsRequest) {
            this.tagsRequest.stop();
        }
        const tagsRequest = new GetTagsRequest({
            setState: params => this.setState(params),
            setProjectTags: this.props.setProjectTags,
        });
        this.tagsRequest = tagsRequest.create(projectId);
        this.tagsRequest.start();
    }

    reloadTasks = () => {
        this.startRequestForTasks(this.props.projectId);
    }

    reloadTags = () => {
        this.startRequestForTags(this.props.projectId);
    }

    render() {
        const {
            projectId,
            project,
            tasks,
            tags,
        } = this.props;

        if (!project || !projectId) {
            return <div />;
        }

        const {
            loadingProject,
            loadingTasks,
            loadingTags,
        } = this.state;

        const loading = loadingProject || loadingTasks || loadingTags;

        return (
            <div>
                {loading && <LoadingAnimation />}
                <p>{project.title}</p>
                <p>{project.description}</p>
                <div>
                    Tasks
                    <AddTask
                        userGroupId={project.userGroup}
                        projectId={projectId}
                        disabledProjectChange
                        disabled={loading}
                        onTaskCreate={this.reloadTasks}
                    />
                    <Table
                        data={tasks}
                        headers={taskHeaders}
                        keyExtractor={keyExtractor}
                    />
                </div>
                <div>
                    Tags
                    <AddTag
                        projectId={projectId}
                        disabledProjectChange
                        disabled={loading}
                        onTagCreate={this.reloadTags}
                    />
                    <Table
                        data={tags}
                        headers={tagHeaders}
                        keyExtractor={keyExtractor}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    projectId: projectIdFromRouteSelector(state),
    project: projectSelector(state),
    tasks: projectTasksSelector(state),
    tags: projectTagsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setProject: (params: SetProjectAction) => dispatch(setProjectAction(params)),
    setProjectTasks: (params: SetProjectTasksAction) => dispatch(setProjectTasksAction(params)),
    setProjectTags: (params: SetProjectTagsAction) => dispatch(setProjectTagsAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Project);
