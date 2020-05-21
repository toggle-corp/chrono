import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { isObjectEmpty } from '#rsu/common';
import { RestRequest } from '#rsu/rest';

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

import GetOverviewSlotStatsRequest from './requests/GetOverviewSlotStatsRequest';
import GetProjectWiseSlotStatsRequest from './requests/GetProjectWiseSlotStatsRequest';
import GetDayWiseSlotStatsRequest from './requests/GetDayWiseSlotStatsRequest';

import GetSlotFilterOptionsRequest from './requests/GetSlotFilterOptions';

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

export class RequestManager extends React.PureComponent<Props, States> {
    slotStatsRequest: RestRequest;
    slotFilterOptionsRequest: RestRequest;
    slotsRequest: RestRequest;

    componentDidMount() {
        const {
            activeView,
            overviewFilter,
            projectWiseFilter,
            dayWiseFilter,
        } = this.props;

        this.startRequestForSlotFilterOptions();
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
        if (this.slotFilterOptionsRequest) {
            this.slotFilterOptionsRequest.stop();
        }
    }

    startRequestForOverviewSlotStats = (params: OverviewParams, activeView: string) => {
        if (activeView !== 'overview' || isObjectEmpty(params.date)) {
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
        if (activeView !== 'projectWise' || isObjectEmpty(params.date)) {
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
        if (activeView !== 'dayWise' || isObjectEmpty(params.date)) {
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

    startRequestForSlotFilterOptions = () => {
        if (this.slotFilterOptionsRequest) {
            this.slotFilterOptionsRequest.stop();
        }
        const request = new GetSlotFilterOptionsRequest({
            setLoadings: this.props.setLoadings,
            setUsers: this.props.setUsers,
            setUserGroups: this.props.setUserGroups,
            setUserProjects: this.props.setUserProjects,
            setUserTasks: this.props.setUserTasks,
        });
        this.slotFilterOptionsRequest = request.create();
        this.slotFilterOptionsRequest.start();
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
)(RequestManager);
