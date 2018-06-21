import update from '../../../vendor/react-store/utils/immutable-update';

import {
    SiloDomainData,
    ReducerGroup,
    SetOverviewSlotStatsAction,
    SetOverviewFiltersAction,
    SetDashboardLoadingsAction,
} from '../../interface';

// ACTION-TYPE

export const enum SILO_DASHBOARD_ACTION {
    setDashboardActiveView = 'siloDomainData/DASHBOARD/ACTIVE_VIEW',
    setDashboardLoadings = 'siloDomainData/DASHBOARD/LOADINGS',
    setOverviewFilters = 'siloDomainData/DASHBOARD/SET_OVERVIEW_FILTERS',
    setOverviewSlotStats = 'siloDomainData/DASHBOARD/SET_OVERVIEW_SLOT_STATS',
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

// HELPER

const setIfDefined = (data: any) => {
    return { $if: [data !== undefined, { $set: data }] };
};

// REDUCER

const setDashboardActiveView = (state: SiloDomainData, { view } : { view: string }) => {
    const settings = {
        dashboard: { $auto: {
            activeView: {
                $set: view,
            },
        } },
    };
    return update(state, settings);
};

const setOverviewSlotStats = (state: SiloDomainData, action: SetOverviewSlotStatsAction) => {
    const { slotStats } = action;
    const settings = {
        dashboard: { $auto: {
            overview: { $auto: {
                data: { $autoArray: {
                    $set: slotStats,
                } },
            } },
        } },
    };
    return update(state, settings);
};

const setOverviewFilters = (state: SiloDomainData, action: SetOverviewFiltersAction) => {
    const {
        filters,
        faramValues,
        faramErrors,
        pristine,
    } = action;
    const settings = {
        dashboard: { $auto: {
            overview: { $auto: {
                faram: { $auto: {
                    filters: setIfDefined(filters),
                    faramValues: setIfDefined(faramValues),
                    faramErrors: setIfDefined(faramErrors),
                    pristine: setIfDefined(pristine),
                } },
            } },
        } },
    };
    return update(state, settings);
};

const setDashboardLoadings = (state: SiloDomainData, action: SetDashboardLoadingsAction) => {
    const {
        overviewLoading,
        projectsLoading,
        tasksLoading,
        userGroupsLoading,
        usersLoading,
    } = action;
    const settings = {
        dashboard: { $auto: {
            loadings: { $auto: {
                overviewLoading: setIfDefined(overviewLoading),
                projectsLoading: setIfDefined(projectsLoading),
                tasksLoading: setIfDefined(tasksLoading),
                userGroupsLoading: setIfDefined(userGroupsLoading),
                usersLoading: setIfDefined(usersLoading),
            } },
        } },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<SiloDomainData> = {
    [SILO_DASHBOARD_ACTION.setOverviewSlotStats]: setOverviewSlotStats,
    [SILO_DASHBOARD_ACTION.setOverviewFilters]: setOverviewFilters,
    [SILO_DASHBOARD_ACTION.setDashboardLoadings]: setDashboardLoadings,
    [SILO_DASHBOARD_ACTION.setDashboardActiveView]: setDashboardActiveView,
};

export default reducer;
