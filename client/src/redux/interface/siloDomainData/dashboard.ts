import { FaramErrors } from '#rscg/Faram';

export interface Dashboard {
    overview: View<OverviewSlotStat, OverviewParams>;
    projectWise: View<ProjectWiseSlotStat, ProjectWiseParams>;
    dayWise: View<DayWiseSlotStat, DayWiseParams>;
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

export interface FaramDate {
    startDate: string;
    endDate: string;
}

export interface DashboardLoadings {
    projectsLoading: boolean;
    tasksLoading: boolean;
    userGroupsLoading: boolean;
    usersLoading: boolean;
    overviewLoading: boolean;
    projectWiseLoading: boolean;
    dayWiseLoading: boolean;
}

// OVERVIEW VIEW
export interface OverviewParams {
    user: number;
    userGroup: number;
    project: number[];
    task: number[];
    tag: number[];
    date?: FaramDate;
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

// PROJECT WISE VIEW
export interface ProjectWiseParams {
    project: number;
    date: FaramDate;
}

export interface ProjectWiseSlotStat {
    // NOTE: id is userId
    id: number;
    user: number;
    userDisplayName: string;
    project: number;
    projectTitle: string;
    totalTasks: number;
    totalTime: string;
    totalTimeInSeconds: number;
}

// DAY WISE VIEW
export interface DayWiseParams {
    date: FaramDate;
    users: number[];
}

export interface DayWiseSlotStat {
    // NOTE: id is userId
    date: string;
    users: {
        id: number;
        totalTime: string;
        totalTimeInSeconds: number;
    }[];
}

export type OverviewFilter = DashboardFilter<OverviewParams>;
export type ProjectWiseFilter = DashboardFilter<ProjectWiseParams>;
export type DayWiseFilter = DashboardFilter<DayWiseParams>;

// ACTION-CREATOR INTERFACE

export type SetDashboardLoadingsAction = Partial<DashboardLoadings>;

export interface SetOverviewSlotStatsAction {
    slotStats: OverviewSlotStat[];
}
export interface SetProjectWiseSlotStatsAction {
    slotStats: ProjectWiseSlotStat[];
}
export interface SetDayWiseSlotStatsAction {
    slotStats: DayWiseSlotStat[];
}

export type SetOverviewFiltersAction = Partial<OverviewFilter>;
export type SetProjectWiseFiltersAction = Partial<ProjectWiseFilter>;
export type SetDayWiseFiltersAction = Partial<DayWiseFilter>;
