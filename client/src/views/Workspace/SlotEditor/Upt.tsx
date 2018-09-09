import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';
import MultiSelectInput from '../../../vendor/react-store/components/Input/MultiSelectInput';

import {
    RootState,
    UserGroup,
    Project,
    Task,
    Tag,
} from '../../../redux/interface';
import {
    userGroupsSelector,
    projectsSelector,
    tasksSelector,
    tagsSelector,
} from '../../../redux';

import * as styles from './styles.scss';

interface WithIdAndTitle {
    id: number;
    title: string;
}

interface OwnProps {
    userGroupId?: number;
    projectId?: number;
    pending?: boolean;
    taskChild?: string | React.ReactNode;
    tagChild?: string | React.ReactNode;
    hideTasks?: boolean;
    disabledUserGroupChange?: boolean;
    disabledProjectChange?: boolean;
}
interface PropsFromState {
    userGroups: UserGroup[];
    projects: Project[];
    tasks: Task[];
    tags: Tag[];
}
interface PropsFromDispatch {}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    projects: Project[];
    tasks: Task[];
    tags: Tag[];
}

const emptyArray: object[] = [];

export class Upt extends React.PureComponent<Props, State> {
    static keySelector = (d: WithIdAndTitle) => d.id;
    static labelSelector = (d: WithIdAndTitle) => d.title;

    static filterProjectByUserGroupId = (projects: Project[], userGroupId?: number) => {
        if (!userGroupId) {
            return emptyArray as Project[];
        }
        return projects.filter(project => project.userGroup === userGroupId);
    }

    static filterTaskByProjectId = (tasks: Task[], projectId?: number) => {
        if (!projectId) {
            return emptyArray as Task[];
        }
        return tasks.filter(task => task.project === projectId);
    }

    static filterTagByProjectId = (tags: Tag[], projectId?: number) => {
        if (!projectId) {
            return emptyArray as Tag[];
        }
        return tags.filter(tag => tag.project === projectId);
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            projects: Upt.filterProjectByUserGroupId(
                props.projects,
                props.userGroupId,
            ),
            tasks: Upt.filterTaskByProjectId(
                props.tasks,
                props.projectId,
            ),
            tags: Upt.filterTagByProjectId(
                props.tags,
                props.projectId,
            ),
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        if (
            this.props.userGroupId !== nextProps.userGroupId
            || this.props.projects !== nextProps.projects
        ) {
            this.setState({
                projects: Upt.filterProjectByUserGroupId(
                    nextProps.projects,
                    nextProps.userGroupId,
                ),
            });
        }

        if (
            this.props.projectId !== nextProps.projectId
            || this.props.tasks !== nextProps.tasks
        ) {
            this.setState({
                tasks: Upt.filterTaskByProjectId(
                    nextProps.tasks,
                    nextProps.projectId,
                ),
            });
        }
        if (
            this.props.projectId !== nextProps.projectId
            || this.props.tags !== nextProps.tags
        ) {
            this.setState({
                tags: Upt.filterTagByProjectId(
                    nextProps.tags,
                    nextProps.projectId,
                ),
            });
        }
    }

    render() {
        const {
            projects,
            tasks,
            tags,
        } = this.state;
        const {
            userGroups,
            taskChild,
            tagChild,
            pending,
            disabledUserGroupChange,
            disabledProjectChange,
            hideTasks,
        } = this.props;

        return (
            <Fragment>
                <SelectInput
                    faramElementName="userGroup"
                    className={styles.usergroup}
                    label="User Group"
                    options={userGroups}
                    placeholder="Select a user group"
                    keySelector={Upt.keySelector}
                    labelSelector={Upt.labelSelector}
                    disabled={disabledProjectChange || disabledUserGroupChange || pending}
                />
                <SelectInput
                    faramElementName="project"
                    label="Project"
                    className={styles.project}
                    options={projects}
                    placeholder="Select a project"
                    keySelector={Upt.keySelector}
                    labelSelector={Upt.labelSelector}
                    disabled={disabledProjectChange || pending}
                />
                { !hideTasks &&
                    <Fragment>
                        <SelectInput
                            className={styles.task}
                            faramElementName="task"
                            label="Task"
                            options={tasks}
                            placeholder="Select a task"
                            keySelector={Upt.keySelector}
                            labelSelector={Upt.labelSelector}
                        />
                        {taskChild}
                    </Fragment>
                }
                <MultiSelectInput
                    className={styles.tag}
                    faramElementName="tags"
                    label="Tags"
                    options={tags}
                    placeholder="Select tags"
                    keySelector={Upt.keySelector}
                    labelSelector={Upt.labelSelector}
                />
                {tagChild}
            </Fragment>
        );
    }
}

const mapStateToProps = (state: RootState, props: OwnProps) => ({
    userGroups: userGroupsSelector(state),
    projects: projectsSelector(state),
    tasks: tasksSelector(state),
    tags: tagsSelector(state),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps,
)(Upt);
