import { createSelector } from 'reselect';
import {
    RootState,
    Dashboard,
    OverviewFilter,
    OverviewParams,
    OverviewSlotStat,
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
