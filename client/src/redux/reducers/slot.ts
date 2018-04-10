import update from '../../vendor/react-store/utils/immutable-update';
import createReducerWithMap from '../../utils/createReducerWithMap';

import {
    DomainData,
    ReducerGroup,
    SlotData,
    TimeslotView,
} from '../interface';
import initialDominDataState from '../initial-state/domainData';

// ACTION-TYPE

export const enum SLOT_DATA_ACTION {
    setSlot = 'domainData/SET_SLOT',
    setSlotView = 'domainData/SET_SLOT_VIEW',
}

// ACTION-CREATOR

export const setSlotAction = (data: SlotData) => ({
    data,
    type: SLOT_DATA_ACTION.setSlot,
});

export const setSlotViewAction = (params: TimeslotView) => ({
    params,
    type: SLOT_DATA_ACTION.setSlotView,
});

// HELPER

// REDUCER

// Slot
const setSlotData = (state: DomainData, action: { data: SlotData }) => {
    const { data } = action;
    const settings = {
        workspace: {
            timeslot: {
                [data.date]: { $auto: {
                    [data.id]: {
                        $set: data,
                    },
                } },
            },
        },
    };
    return update(state, settings);
};

const setSlotViewData = (state: DomainData, action: { params: TimeslotView }) => {
    const { params } = action;
    const settings = {
        timeslotViews: {
            [params.data.id]: {
                $set: params,
            },
        },
    };
    return update(state, settings);
};

export const slotReducer: ReducerGroup<DomainData> = {
    [SLOT_DATA_ACTION.setSlot]: setSlotData,
    [SLOT_DATA_ACTION.setSlotView]: setSlotViewData,
};

export default createReducerWithMap(slotReducer, initialDominDataState);
