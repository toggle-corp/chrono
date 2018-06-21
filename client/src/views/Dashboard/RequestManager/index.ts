import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { RestRequest } from '../../../vendor/react-store/utils/rest';

import {
    RootState,
    UserGroup,
    Project,
    Task,
    OverviewParams,
    SetDashboardLoadingsAction,
    SetUsersAction,
    SetOverviewSlotStatsAction,
} from '../../../redux/interface';
import {
    setUserGroupsAction,
    setProjectsAction,
    setTasksAction,
    setDashboardLoadingsAction,
    setUsersAction,
    setOverviewSlotStatsAction,
    overviewFilterSelector,
}  from '../../../redux';

import GetOverviewSlotStatsRequest from './requests/GetOverviewSlotStatsRequest';
import GetUserGroupsRequest from './requests/GetUserGroupsRequest';
import GetProjectsRequest from './requests/GetProjectsRequest';
import GetTasksRequest from './requests/GetTasksRequest';
import GetUsersRequest from './requests/GetUsersRequest';

interface OwnProps {
    type: string;
}
interface PropsFromState {
    overviewFilter: OverviewParams;
}
interface PropsFromDispatch {
    setUserGroups(params: UserGroup[]): void;
    setUserProjects(params: Project[]): void;
    setUserTasks(params: Task[]): void;
    setOverviewSlotStats(params: SetOverviewSlotStatsAction): void;
    setUsers(params: SetUsersAction): void;
    setLoadings(params: SetDashboardLoadingsAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {}

export class RequestManger extends React.PureComponent<Props, States> {
    slotStatsRequest: RestRequest;
    userGroupsRequest: RestRequest;
    usersRequest: RestRequest;
    projectsRequest: RestRequest;
    tasksRequest: RestRequest;
    slotsRequest: RestRequest;

    componentWillMount() {
        this.startRequestForUserGroups();
        this.startRequestForUsers();
        this.startRequestForProjects();
        this.startRequestForTasks();
        this.startRequestForOverviewSlotStats(this.props.overviewFilter);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.overviewFilter !== nextProps.overviewFilter) {
            this.startRequestForOverviewSlotStats(nextProps.overviewFilter);
        }
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

    startRequestForOverviewSlotStats = (params: OverviewParams) => {
        if (this.props.type !== 'overview') {
            return;
        }
        if (this.slotStatsRequest) {
            this.slotStatsRequest.stop();
        }
        const slotStatsRequest = new GetOverviewSlotStatsRequest({
            setLoadings: this.props.setLoadings,
            setOverviewSlotStats: this.props.setOverviewSlotStats,
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
            setLoadings: this.props.setLoadings,
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
            setLoadings: this.props.setLoadings,
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
            setLoadings: this.props.setLoadings,
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
            setLoadings: this.props.setLoadings,
        });
        this.usersRequest = request.create();
        this.usersRequest.start();
    }

    render() {
        return null;
    }
}

const mapStateToProps = (state: RootState) => ({
    overviewFilter: overviewFilterSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setLoadings: (params: SetDashboardLoadingsAction) =>
        dispatch(setDashboardLoadingsAction(params)),
    setUsers: (params: SetUsersAction) => dispatch(setUsersAction(params)),
    setUserGroups: (params: UserGroup[]) => dispatch(setUserGroupsAction(params)),
    setUserProjects: (params: Project[]) => dispatch(setProjectsAction(params)),
    setUserTasks: (params: Task[]) => dispatch(setTasksAction(params)),
    setOverviewSlotStats: (params: SetOverviewSlotStatsAction) =>
        dispatch(setOverviewSlotStatsAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(RequestManger);
