import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import SelectInput from '#rsci/SelectInput';
import MultiSelectInput from '#rsci/MultiSelectInput';

import {
    RootState,
    UserGroup,
    Project,
    Task,
    Tag,
} from '../../../../../redux/interface';
import {
    userGroupsSelector,
    projectsSelector,
    tasksSelector,
    tagsSelector,
} from '../../../../../redux';

import * as styles from './styles.scss';

interface WithIdAndTitle {
    id: number;
    title: string;
}

interface OwnProps {
    userGroupId?: number;
    projectIds?: number[];
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

export class UGProjectsTasks extends React.PureComponent<Props, State> {
    static keySelector = (d: WithIdAndTitle) => d.id;
    static labelSelector = (d: WithIdAndTitle) => d.title;

    static filterProjectByUserGroupId = (projects: Project[], userGroupId?: number) => {
        if (!userGroupId) {
            return emptyArray as Project[];
        }
        return projects.filter(project => project.userGroup === userGroupId);
    }

    static filterTasksByProjectIds = (tasks: Task[], projectIds?: number[]) => {
        if (!projectIds || !projectIds.length) {
            return emptyArray as Task[];
        }
        return tasks.filter(task => projectIds.indexOf(task.project) > -1);
    }

    static filterTagsByProjectIds = (tags: Tag[], projectIds?: number[]) => {
        if (!projectIds || !projectIds.length) {
            return emptyArray as Tag[];
        }
        return tags.filter(tag => projectIds.indexOf(tag.project) > -1);
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            projects: UGProjectsTasks.filterProjectByUserGroupId(
                props.projects,
                props.userGroupId,
            ),
            tasks: UGProjectsTasks.filterTasksByProjectIds(
                props.tasks,
                props.projectIds,
            ),
            tags: UGProjectsTasks.filterTagsByProjectIds(
                props.tags,
                props.projectIds,
            ),
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        if (
            this.props.userGroupId !== nextProps.userGroupId
            || this.props.projects !== nextProps.projects
        ) {
            this.setState({
                projects: UGProjectsTasks.filterProjectByUserGroupId(
                    nextProps.projects,
                    nextProps.userGroupId,
                ),
            });
        }

        if (
            this.props.projectIds !== nextProps.projectIds
            || this.props.tasks !== nextProps.tasks
        ) {
            this.setState({
                tasks: UGProjectsTasks.filterTasksByProjectIds(
                    nextProps.tasks,
                    nextProps.projectIds,
                ),
            });
        }
        if (
            this.props.projectIds !== nextProps.projectIds
            || this.props.tags !== nextProps.tags
        ) {
            this.setState({
                tags: UGProjectsTasks.filterTagsByProjectIds(
                    nextProps.tags,
                    nextProps.projectIds,
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
                    className={styles.input}
                    label="User Group"
                    options={userGroups}
                    placeholder="Select a user group"
                    keySelector={UGProjectsTasks.keySelector}
                    labelSelector={UGProjectsTasks.labelSelector}
                    disabled={disabledProjectChange || disabledUserGroupChange || pending}
                />
                <MultiSelectInput
                    faramElementName="project"
                    label="Project"
                    className={styles.input}
                    options={projects}
                    placeholder="Select a project"
                    keySelector={UGProjectsTasks.keySelector}
                    labelSelector={UGProjectsTasks.labelSelector}
                    disabled={disabledProjectChange || pending}
                />
                { !hideTasks &&
                    <Fragment>
                        <MultiSelectInput
                            className={styles.input}
                            faramElementName="task"
                            label="Task"
                            options={tasks}
                            placeholder="Select a task"
                            keySelector={UGProjectsTasks.keySelector}
                            labelSelector={UGProjectsTasks.labelSelector}
                        />
                        {taskChild}
                    </Fragment>
                }
                <MultiSelectInput
                    className={styles.input}
                    faramElementName="tags"
                    label="Tags"
                    options={tags}
                    placeholder="Select tags"
                    keySelector={UGProjectsTasks.keySelector}
                    labelSelector={UGProjectsTasks.labelSelector}
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
)(UGProjectsTasks);
