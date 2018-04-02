import update from '../../vendor/react-store/utils/immutable-update';
import createReducerWithMap from '../../utils/createReducerWithMap';

import { DayData, DomainData, ReducerGroup, UserGroup } from '../interface';
import initialDominDataState from '../initial-state/domainData';

// ACTION-TYPE

export const enum DAY_DATA_ACTION {
    setDay = 'DOMAIN_DATA/SET_DAY',
}

export const enum USERGROUP_ACTION {
    setUserGroups = 'DOMAIN_DATA/SET_USERGROUPS',
}

// ACTION-CREATOR

export const setDataAction = (timestamp: number, data: DayData) => ({
    type: DAY_DATA_ACTION.setDay,
    timestamp,
    data,
});

export const setUserGroupsAction = (userGroups: UserGroup[]) => ({
    type: USERGROUP_ACTION.setUserGroups,
    userGroups,
});

// HELPER

// REDUCER

const setDayData = (state: DomainData, action: { timestamp: number, data: DayData }) => {
    const { data, timestamp } = action;
    const settings = {
        dayData: {
            [timestamp]: { $auto: {
                $set: data,
            } },
        },
    };
    return update(state, settings);
};

const setUserGroups = (state: DomainData, action: { userGroups: UserGroup[] }) => {
    const { userGroups } = action;
    const settings = {
        userGroups: { $auto: {
            $set: userGroups,
        } },
    };
    return update(state, settings);
};

export const domainDataReducer: ReducerGroup<DomainData> = {
    [DAY_DATA_ACTION.setDay]: setDayData,
    [USERGROUP_ACTION.setUserGroups]: setUserGroups,
};

export default createReducerWithMap(domainDataReducer, initialDominDataState);
