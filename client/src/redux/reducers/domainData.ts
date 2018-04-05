import update from '../../vendor/react-store/utils/immutable-update';
import createReducerWithMap from '../../utils/createReducerWithMap';

import {
    DomainData,
    ReducerGroup,
    SlotData,
    UserGroup,
} from '../interface';
import initialDominDataState from '../initial-state/domainData';

// ACTION-TYPE

export const enum SLOT_DATA_ACTION {
    setSlot = 'domainData/SET_SLOT',
}

export const enum USERGROUP_ACTION {
    setUserGroups = 'domainData/SET_USERGROUPS',
}

// ACTION-CREATOR

export const setSlotAction = (data: SlotData) => ({
    data,
    type: SLOT_DATA_ACTION.setSlot,
});

export const setUserGroupsAction = (userGroups: UserGroup[]) => ({
    userGroups,
    type: USERGROUP_ACTION.setUserGroups,
});

// HELPER

// REDUCER

const setSlotData = (state: DomainData, action: { data: SlotData }) => {
    const { data } = action;
    const settings = {
        slotData: {
            $auto: {
                $set: data,
            },
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
    [USERGROUP_ACTION.setUserGroups]: setUserGroups,
    [SLOT_DATA_ACTION.setSlot]: setSlotData,
};

export default createReducerWithMap(domainDataReducer, initialDominDataState);
