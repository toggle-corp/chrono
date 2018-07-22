import { createSelector } from 'reselect';
import {
    RootState,
    Dashboard,
    OverviewFilter,
    OverviewParams,
    OverviewSlotStat,
    ProjectWiseFilter,
    ProjectWiseParams,
    ProjectWiseSlotStat,
    DayWiseFilter,
    DayWiseParams,
    DayWiseSlotStat,
} from '../../interface';

const emptyObject = {};
const emptyFaram = {
    filters: {},
    faramValues: {},
};
const emptyArray: object[] = [];

// SIMPLE

const dashboardSelector = ({ siloDomainData }: RootState): Dashboard => (
    siloDomainData.dashboard || emptyObject as Dashboard
);

// COMPLEX
export const dashboardActiveViewSelector = createSelector(
    dashboardSelector,
    dashboard => dashboard.activeView,
);

export const dashboardLoadingSelector = createSelector(
    dashboardSelector,
    dashboard => dashboard.loadings,
);

// DASHBOARD OVERVIEW SELECTORS
const overviewSelector = createSelector(
    dashboardSelector,
    dashboard => dashboard.overview || emptyObject,
);

export const overviewFaramSelector = createSelector(
    overviewSelector,
    overview => overview.faram || emptyFaram as OverviewFilter,
);

export const overviewFilterSelector = createSelector(
    overviewFaramSelector,
    faram => faram.filters || emptyObject as OverviewParams,
);

export const overviewSlotStatsSelector = createSelector(
    overviewSelector,
    overview => overview.data || emptyArray as OverviewSlotStat[],
);

// DASHBOARD PROJECT WISE SELECTORS
const projectWiseSelector = createSelector(
    dashboardSelector,
    dashboard => dashboard.projectWise || emptyObject,
);

export const projectWiseFaramSelector = createSelector(
    projectWiseSelector,
    projectWise => projectWise.faram || emptyFaram as ProjectWiseFilter,
);

export const projectWiseFilterSelector = createSelector(
    projectWiseFaramSelector,
    faram => faram.filters || emptyObject as ProjectWiseParams,
);

export const projectWiseSlotStatsSelector = createSelector(
    projectWiseSelector,
    projectWise => projectWise.data || emptyArray as ProjectWiseSlotStat[],
);

// DASHBOARD DAY WISE SELECTORS
const dayWiseSelector = createSelector(
    dashboardSelector,
    dashboard => dashboard.dayWise || emptyObject,
);

export const dayWiseFaramSelector = createSelector(
    dayWiseSelector,
    dayWise => dayWise.faram || emptyFaram as DayWiseFilter,
);

export const dayWiseFilterSelector = createSelector(
    dayWiseFaramSelector,
    faram => faram.filters || emptyObject as DayWiseParams,
);

export const dayWiseSlotStatsSelector = createSelector(
    dayWiseSelector,
    dayWise => dayWise.data || emptyArray as DayWiseSlotStat[],
);
