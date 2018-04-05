import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import ListView from '../../vendor/react-store/components/View/List/ListView';
import { RestRequest } from '../../vendor/react-store/utils/rest';

import { 
    setUserGroupsAction,
    setProjectsAction,
    setTasksAction,
} from '../../redux';
import { RootState, UserGroup, Project, Task } from '../../redux/interface';
import SlotEditor from './SlotEditor';
import * as styles from './styles.scss';

import GetUserGroupsRequest from './requests/GetUserGroupsRequest';
import GetProjectsRequest from './requests/GetProjectsRequest';
import GetTasksRequest from './requests/GetTasksRequest';

interface OwnProps {}
interface PropsFromState { }
interface PropsFromDispatch {
    setUserGroups(params: UserGroup[]): void;
    setUserProjects(params: Project[]): void;
    setUserTasks(params: Task[]): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    data: Data[];
    pending: boolean;
}

interface Data {
    timestamp: number;
    month: number;
    year: number;
}

export class Workspace extends React.PureComponent<Props, States> {
    userGroupRequest: RestRequest;
    projectsRequest: RestRequest;
    tasksRequest: RestRequest;

    static keyExtractor = (data: Data) => String(data.timestamp);

    constructor(props: Props) {
        super(props);

        const date = new Date();
        const data: Data[] = [
            {
                timestamp: + date,
                month: date.getMonth(),
                year: date.getFullYear(),
            },
        ];

        this.state = {
            data,
            pending: false,
        };
    }

    componentWillMount() {
        this.startRequestForUserGroup();
        this.startRequestForProjects();
        this.startRequestForTasks();
    }

    componentWillUnmount() {
        if (this.userGroupRequest) {
            this.userGroupRequest.stop();
        }
    }

    startRequestForProjects = () => {
        if (this.projectsRequest) {
            this.projectsRequest.stop();
        }
        const request = new GetProjectsRequest({
            setUserProjects: this.props.setUserProjects,
            setState: params => this.setState(params),
        });
        this.projectsRequest = request.create();
        this.projectsRequest.start();
    }

    startRequestForTasks = () => {
        if (this.tasksRequest) {
            this.tasksRequest.stop();
        }
        const request = new GetTasksRequest({
            setUserTasks: this.props.setUserTasks,
            setState: params => this.setState(params),
        });
        this.tasksRequest = request.create();
        this.tasksRequest.start();
    }

    startRequestForUserGroup = () => {
        if (this.userGroupRequest) {
            this.userGroupRequest.stop();
        }
        const request = new GetUserGroupsRequest({
            setUserGroups: this.props.setUserGroups,
            setState: params => this.setState(params),
        });
        this.userGroupRequest = request.create();
        this.userGroupRequest.start();
    }

    renderDay = (key: string, date: Data) => (
        <div key={key}>
            {date.year} / {date.month}
        </div>
    )

    render() {
        const { data } = this.state;
        return (
            <div className={styles.workspace}>
                <div className={styles.datebar}>
                    <ListView
                        className={styles.listView}
                        data={data}
                        modifier={this.renderDay}
                    />
                </div>
                <div className={styles.information} >
                    <div className={styles.datewrapper}>
                        01, Wednesday
                    </div>
                    <div className={styles.datewrapper}>
                        02, Thursday
                    </div>
                </div>
                <SlotEditor />
                <div className={styles.bottom} >
                    Bottom Part
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setUserGroups: (params: UserGroup[]) => dispatch(setUserGroupsAction(params)),
    setUserProjects: (params: Project[]) => dispatch(setProjectsAction(params)),
    setUserTasks: (params: Task[]) => dispatch(setTasksAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    undefined, mapDispatchToProps,
)(Workspace);
