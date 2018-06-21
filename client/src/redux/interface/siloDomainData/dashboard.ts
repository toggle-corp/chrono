import { FaramErrors } from '../../../vendor/react-store/components/Input/Faram';

export interface Dashboard {
    overview: View<OverviewSlotStat, OverviewParams>;
    loadings: DashboardLoadings;
    activeView: string;
}

interface View<D, F> {
    data?: D[];
    faram?: DashboardFilter<F>;
}

export interface DashboardFilter<T> {
    filters: T;
    faramValues: T;
    faramErrors: FaramErrors;
    pristine: boolean;
}

interface Date {
    startDate: string;
    endDate: string;
}

export interface DashboardLoadings {
    overviewLoading: boolean;
    projectsLoading: boolean;
    tasksLoading: boolean;
    userGroupsLoading: boolean;
    usersLoading: boolean;
}

// OVERVIEW VIEW
export interface OverviewParams {
    user: number;
    userGroup: number;
    project: number;
    task: number;
    date: Date;
}

export interface OverviewSlotStat {
    id: number;
    userGroup: number;
    project: number;
    userGroupDisplayName: string;
    projectDisplayName: string;
    userDisplayName: string;
    taskDisplayName: string;
    taskDescription: string;
    date: string;
    startTime: string;
    endTime: string;
    totalTime: string;
    totalTimeInSeconds: number;
    remarks: string;
    task: number;
    user: number;
}

export type OverviewFilter = DashboardFilter<OverviewParams>;

// ACTION-CREATOR INTERFACE

export type SetDashboardLoadingsAction = Partial<DashboardLoadings>;

export interface SetOverviewSlotStatsAction {
    slotStats: OverviewSlotStat[];
}

export type SetOverviewFiltersAction = Partial<OverviewFilter>;
