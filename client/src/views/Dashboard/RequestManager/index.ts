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
    ProjectWiseParams,
    DayWiseParams,
    SetDashboardLoadingsAction,
    SetUsersAction,
    SetOverviewSlotStatsAction,
    SetProjectWiseSlotStatsAction,
    SetDayWiseSlotStatsAction,
} from '../../../redux/interface';
import {
    setUserGroupsAction,
    setProjectsAction,
    setTasksAction,
    setDashboardLoadingsAction,
    setUsersAction,
    setOverviewSlotStatsAction,
    setProjectWiseSlotStatsAction,
    setDayWiseSlotStatsAction,
    dashboardActiveViewSelector,
    overviewFilterSelector,
    projectWiseFilterSelector,
    dayWiseFilterSelector,
}  from '../../../redux';

import { Dashboard } from '../index';

import GetOverviewSlotStatsRequest from './requests/GetOverviewSlotStatsRequest';
import GetProjectWiseSlotStatsRequest from './requests/GetProjectWiseSlotStatsRequest';
import GetDayWiseSlotStatsRequest from './requests/GetDayWiseSlotStatsRequest';

import GetUserGroupsRequest from './requests/GetUserGroupsRequest';
import GetProjectsRequest from './requests/GetProjectsRequest';
import GetTasksRequest from './requests/GetTasksRequest';
import GetUsersRequest from './requests/GetUsersRequest';

interface OwnProps {}
interface PropsFromState {
    activeView: string;
    overviewFilter: OverviewParams;
    projectWiseFilter: ProjectWiseParams;
    dayWiseFilter: DayWiseParams;
}
interface PropsFromDispatch {
    setUserGroups(params: UserGroup[]): void;
    setUserProjects(params: Project[]): void;
    setUserTasks(params: Task[]): void;
    setUsers(params: SetUsersAction): void;
    setLoadings(params: SetDashboardLoadingsAction): void;
    setOverviewSlotStats(params: SetOverviewSlotStatsAction): void;
    setProjectWiseSlotStats(params: SetProjectWiseSlotStatsAction): void;
    setDayWiseSlotStats(params: SetDayWiseSlotStatsAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {}

// FIXME: Rename RequestManger to RequestManager
export class RequestManger extends React.PureComponent<Props, States> {
    slotStatsRequest: RestRequest;
    userGroupsRequest: RestRequest;
    usersRequest: RestRequest;
    projectsRequest: RestRequest;
    tasksRequest: RestRequest;
    slotsRequest: RestRequest;

    componentWillMount() {
        const {
            activeView,
            overviewFilter,
            projectWiseFilter,
            dayWiseFilter,
        } = this.props;
        this.startRequestForUserGroups();
        this.startRequestForUsers();
        this.startRequestForProjects();
        this.startRequestForTasks();
        this.startRequestForOverviewSlotStats(overviewFilter, activeView);
        this.startRequestForProjectWiseSlotStats(projectWiseFilter, activeView);
        this.startRequestForDayWiseSlotStats(dayWiseFilter, activeView);
    }

    componentWillReceiveProps(nextProps: Props) {
        const {
            activeView,
            overviewFilter,
            projectWiseFilter,
            dayWiseFilter,
        } = nextProps;
        const forceUpdate = this.props.activeView !== nextProps.activeView;

        if (forceUpdate || this.props.overviewFilter !== overviewFilter) {
            this.startRequestForOverviewSlotStats(overviewFilter, activeView);
        }
        if (forceUpdate || this.props.projectWiseFilter !== projectWiseFilter) {
            this.startRequestForProjectWiseSlotStats(projectWiseFilter, activeView);
        }
        if (forceUpdate || this.props.dayWiseFilter !== dayWiseFilter) {
            this.startRequestForDayWiseSlotStats(dayWiseFilter, activeView);
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

    startRequestForOverviewSlotStats = (params: OverviewParams, activeView: string) => {
        if (activeView !== Dashboard.views.overview) {
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

    startRequestForProjectWiseSlotStats = (params: ProjectWiseParams, activeView: string) => {
        if (activeView !== Dashboard.views.projectWise) {
            return;
        }
        if (this.slotStatsRequest) {
            this.slotStatsRequest.stop();
        }
        const slotStatsRequest = new GetProjectWiseSlotStatsRequest({
            setLoadings: this.props.setLoadings,
            setProjectWiseSlotStats: this.props.setProjectWiseSlotStats,
        });
        this.slotStatsRequest = slotStatsRequest.create(params);
        this.slotStatsRequest.start();
    }

    startRequestForDayWiseSlotStats = (params: DayWiseParams, activeView: string) => {
        if (activeView !== Dashboard.views.dayWise) {
            return;
        }
        if (this.slotStatsRequest) {
            this.slotStatsRequest.stop();
        }
        const slotStatsRequest = new GetDayWiseSlotStatsRequest({
            setLoadings: this.props.setLoadings,
            setDayWiseSlotStats: this.props.setDayWiseSlotStats,
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
    activeView: dashboardActiveViewSelector(state),
    overviewFilter: overviewFilterSelector(state),
    projectWiseFilter: projectWiseFilterSelector(state),
    dayWiseFilter: dayWiseFilterSelector(state),
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
    setProjectWiseSlotStats: (params: SetProjectWiseSlotStatsAction) =>
        dispatch(setProjectWiseSlotStatsAction(params)),
    setDayWiseSlotStats: (params: SetDayWiseSlotStatsAction) =>
        dispatch(setDayWiseSlotStatsAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(RequestManger);
