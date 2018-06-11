import React, { Fragment } from 'react';
import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';

import {
    UserGroup,
    Project,
    Task,
} from '../../../redux/interface';

import * as styles from './styles.scss';

interface WithIdAndTitle {
    id: number;
    title: string;
}

interface Props {
    userGroups: UserGroup[];
    projects: Project[];
    tasks: Task[];

    userGroupId?: number;
    projectId?: number;
}
interface State {
    projects: Project[];
    tasks: Task[];
}

const emptyArray: object[] = [];

export default class Upt extends React.PureComponent<Props, State> {
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
    }

    render() {
        const {
            projects,
            tasks,
        } = this.state;
        const {
            userGroups,
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
                />
                <SelectInput
                    faramElementName="project"
                    label="Project"
                    className={styles.project}
                    options={projects}
                    placeholder="Select a project"
                    keySelector={Upt.keySelector}
                    labelSelector={Upt.labelSelector}
                />
                <SelectInput
                    className={styles.task}
                    faramElementName="task"
                    label="Task"
                    options={tasks}
                    placeholder="Select a task"
                    keySelector={Upt.keySelector}
                    labelSelector={Upt.labelSelector}
                />
            </Fragment>
        );
    }
}
