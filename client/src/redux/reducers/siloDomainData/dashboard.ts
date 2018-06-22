import update from '../../../vendor/react-store/utils/immutable-update';

import {
    SiloDomainData,
    ReducerGroup,
    SetDashboardLoadingsAction,
    SetOverviewSlotStatsAction,
    SetOverviewFiltersAction,
    SetProjectWiseSlotStatsAction,
    SetProjectWiseFiltersAction,
    SetDayWiseSlotStatsAction,
    SetDayWiseFiltersAction,
} from '../../interface';

// ACTION-TYPE

export const enum SILO_DASHBOARD_ACTION {
    setDashboardActiveView = 'siloDomainData/DASHBOARD/ACTIVE_VIEW',
    setDashboardLoadings = 'siloDomainData/DASHBOARD/LOADINGS',

    setOverviewFilters = 'siloDomainData/DASHBOARD/SET_OVERVIEW_FILTERS',
    setOverviewSlotStats = 'siloDomainData/DASHBOARD/SET_OVERVIEW_SLOT_STATS',

    setProjectWiseFilters = 'siloDomainData/DASHBOARD/SET_PROJECT_WISE_FILTERS',
    setProjectWiseSlotStats = 'siloDomainData/DASHBOARD/SET_PROJECT_WISE_SLOT_STATS',

    setDayWiseFilters = 'siloDomainData/DASHBOARD/SET_DAY_WISE_FILTERS',
    setDayWiseSlotStats = 'siloDomainData/DASHBOARD/SET_DAY_WISE_SLOT_STATS',
}

// ACTION-CREATOR

export const setDashboardActiveViewAction = (
    view: string,
) => ({
    view,
    type: SILO_DASHBOARD_ACTION.setDashboardActiveView,
});

export const setDashboardLoadingsAction = (
    action: SetDashboardLoadingsAction,
) => ({
    ...action,
    type: SILO_DASHBOARD_ACTION.setDashboardLoadings,
});

export const setOverviewSlotStatsAction = ({ slotStats }: SetOverviewSlotStatsAction) => ({
    slotStats,
    type: SILO_DASHBOARD_ACTION.setOverviewSlotStats,
});

export const setOverviewFiltersAction = (
    action: SetOverviewFiltersAction,
) => ({
    ...action,
    type: SILO_DASHBOARD_ACTION.setOverviewFilters,
});

export const setProjectWiseSlotStatsAction = ({ slotStats }: SetProjectWiseSlotStatsAction) => ({
    slotStats,
    type: SILO_DASHBOARD_ACTION.setProjectWiseSlotStats,
});

export const setProjectWiseFiltersAction = (
    action: SetProjectWiseFiltersAction,
) => ({
    ...action,
    type: SILO_DASHBOARD_ACTION.setProjectWiseFilters,
});

export const setDayWiseSlotStatsAction = ({ slotStats }: SetDayWiseSlotStatsAction) => ({
    slotStats,
    type: SILO_DASHBOARD_ACTION.setDayWiseSlotStats,
});

export const setDayWiseFiltersAction = (
    action: SetDayWiseFiltersAction,
) => ({
    ...action,
    type: SILO_DASHBOARD_ACTION.setDayWiseFilters,
});

// REDUCER

const setDashboardActiveView = (
    state: SiloDomainData,
    action : { view: string, type: string },
) => {
    const { view } = action;
    const settings = {
        dashboard: { $auto: {
            activeView: { $set: view },
        } },
    };
    return update(state, settings);
};

const setDashboardLoadings = (
    state: SiloDomainData,
    action: SetDashboardLoadingsAction & { type: string },
) => {
    const { type, ...otherProps } = action;
    const settings = {
        dashboard: { $auto: {
            loadings: { $auto: {
                $merge: otherProps,
            } },
        } },
    };
    return update(state, settings);
};

const setOverviewSlotStats = (
    state: SiloDomainData,
    action: SetOverviewSlotStatsAction & { type: string },
) => {
    const { slotStats } = action;
    const settings = {
        dashboard: { $auto: {
            overview: { $auto: {
                data: { $set: slotStats },
            } },
        } },
    };
    return update(state, settings);
};

const setOverviewFilters = (
    state: SiloDomainData,
    action: SetOverviewFiltersAction & { type: string },
) => {
    const {
        type,
        ...otherProps,
    } = action;
    const settings = {
        dashboard: { $auto: {
            overview: { $auto: {
                faram: { $auto: {
                    $merge: otherProps,
                } },
            } },
        } },
    };
    return update(state, settings);
};

const setProjectWiseSlotStats = (
    state: SiloDomainData,
    action: SetProjectWiseSlotStatsAction & { type: string },
) => {
    const { slotStats } = action;
    const settings = {
        dashboard: { $auto: {
            projectWise: { $auto: {
                data: { $set: slotStats },
            } },
        } },
    };
    return update(state, settings);
};

const setProjectWiseFilters = (
    state: SiloDomainData,
    action: SetProjectWiseFiltersAction & { type: string },
) => {
    const {
        type,
        ...otherProps,
    } = action;

    const settings = {
        dashboard: { $auto: {
            projectWise: { $auto: {
                faram: { $auto: {
                    $merge: otherProps,
                } },
            } },
        } },
    };
    return update(state, settings);
};

const setDayWiseSlotStats = (
    state: SiloDomainData,
    action: SetDayWiseSlotStatsAction & { type: string },
) => {
    const { slotStats } = action;
    const settings = {
        dashboard: { $auto: {
            dayWise: { $auto: {
                data: { $set: slotStats },
            } },
        } },
    };
    return update(state, settings);
};

const setDayWiseFilters = (
    state: SiloDomainData,
    action: SetDayWiseFiltersAction & { type: string },
) => {
    const {
        type,
        ...otherProps,
    } = action;
    const settings = {
        dashboard: { $auto: {
            dayWise: { $auto: {
                faram: { $auto: {
                    $merge: otherProps,
                } },
            } },
        } },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<SiloDomainData> = {
    // DASHBOARD
    [SILO_DASHBOARD_ACTION.setDashboardLoadings]: setDashboardLoadings,
    [SILO_DASHBOARD_ACTION.setDashboardActiveView]: setDashboardActiveView,

    // OVERVIEW
    [SILO_DASHBOARD_ACTION.setOverviewSlotStats]: setOverviewSlotStats,
    [SILO_DASHBOARD_ACTION.setOverviewFilters]: setOverviewFilters,

    // PROJECT WISE
    [SILO_DASHBOARD_ACTION.setProjectWiseSlotStats]: setProjectWiseSlotStats,
    [SILO_DASHBOARD_ACTION.setProjectWiseFilters]: setProjectWiseFilters,

    // DAY WISE
    [SILO_DASHBOARD_ACTION.setDayWiseSlotStats]: setDayWiseSlotStats,
    [SILO_DASHBOARD_ACTION.setDayWiseFilters]: setDayWiseFilters,
};

export default reducer;
