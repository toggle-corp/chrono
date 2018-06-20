import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import Table from '../../vendor/react-store/components/View/Table';
import { RestRequest } from '../../vendor/react-store/utils/rest';

import {
    RootState,
    SlotStat,
    UserGroup,
    Project,
    Task,
    SetSlotStatsAction,
    SetUsersAction,
} from '../../redux/interface';
import {
    setUserGroupsAction,
    setProjectsAction,
    setTasksAction,
    setSlotStatsAction,
    setUsersAction,
    timeSlotStatsSelector,
}  from '../../redux';

import { SlotStatsUrlParams } from '../../rest/interface';

import GetSlotStatsRequest from './requests/GetSlotStatsRequest';
import GetUserGroupsRequest from './requests/GetUserGroupsRequest';
import GetProjectsRequest from './requests/GetProjectsRequest';
import GetTasksRequest from './requests/GetTasksRequest';
import GetUsersRequest from './requests/GetUsersRequest';

import Filter from './Filter';
import headers from './headers';

// import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    timeSlotStats: SlotStat[];
}
interface PropsFromDispatch {
    setUserGroups(params: UserGroup[]): void;
    setUserProjects(params: Project[]): void;
    setUserTasks(params: Task[]): void;
    setTimeSlotStats(params: SetSlotStatsAction): void;
    setUsers(params: SetUsersAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States{
    loading: boolean;
    pendingProjects: boolean;
    pendingTasks: boolean;
    pendingUsergroups: boolean;
    pendingUsers: boolean;
}

const keyExtractor = (slotStat: SlotStat) => slotStat.id;

export class Dashboard extends React.PureComponent<Props, States> {
    slotStatsRequest: RestRequest;
    userGroupsRequest: RestRequest;
    usersRequest: RestRequest;
    projectsRequest: RestRequest;
    tasksRequest: RestRequest;
    slotsRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: true,
            pendingProjects: true,
            pendingTasks: true,
            pendingUsergroups: true,
            pendingUsers: true,
        };
    }

    componentWillMount() {
        this.startRequestForUserGroups();
        this.startRequestForUsers();
        this.startRequestForProjects();
        this.startRequestForTasks();
        this.startRequestForSlotStats({});
    }

    componentWillUnmount() {
        if (this.slotStatsRequest) {
            this.slotStatsRequest.stop();
        }
        if (this.userGroupsRequest) {
            this.userGroupsRequest.stop();
        }
        if (this.usersRequest) {
            this.usersRequest.stop();
        }
        if (this.projectsRequest) {
            this.projectsRequest.stop();
        }
        if (this.tasksRequest) {
            this.tasksRequest.stop();
        }
    }

    startRequestForSlotStats = (params: SlotStatsUrlParams) => {
        if (this.slotStatsRequest) {
            this.slotStatsRequest.stop();
        }
        const slotStatsRequest = new GetSlotStatsRequest({
            setState: params => this.setState(params),
            setTimeSlotStats: this.props.setTimeSlotStats,
        });
        this.slotStatsRequest = slotStatsRequest.create(params);
        this.slotStatsRequest.start();
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

    startRequestForUserGroups = () => {
        if (this.userGroupsRequest) {
            this.userGroupsRequest.stop();
        }
        const request = new GetUserGroupsRequest({
            setUserGroups: this.props.setUserGroups,
            setState: params => this.setState(params),
        });
        this.userGroupsRequest = request.create();
        this.userGroupsRequest.start();
    }

    startRequestForUsers = () => {
        if (this.usersRequest) {
            this.usersRequest.stop();
        }
        const request = new GetUsersRequest({
            setUsers: this.props.setUsers,
            setState: params => this.setState(params),
        });
        this.usersRequest = request.create();
        this.usersRequest.start();
    }

    onFilterChange = (params: SlotStatsUrlParams) => {
        this.startRequestForSlotStats(params);
    }

    render() {
        const { timeSlotStats } = this.props;

        return (
            <div>
                <span> Dashboard</span>
                <Filter
                    onChange={this.onFilterChange}
                />
                <Table
                    data={timeSlotStats}
                    headers={headers}
                    keyExtractor={keyExtractor}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    timeSlotStats: timeSlotStatsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setUserGroups: (params: UserGroup[]) => dispatch(setUserGroupsAction(params)),
    setUsers: (params: SetUsersAction) => dispatch(setUsersAction(params)),
    setUserProjects: (params: Project[]) => dispatch(setProjectsAction(params)),
    setUserTasks: (params: Task[]) => dispatch(setTasksAction(params)),
    setTimeSlotStats: (params: SetSlotStatsAction) =>
        dispatch(setSlotStatsAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Dashboard);
