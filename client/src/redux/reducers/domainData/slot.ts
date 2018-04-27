import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,
    SlotData,
    TimeslotView,
} from '../../interface';

// ACTION-TYPE

export const enum SLOT_DATA_ACTION {
    setSlot = 'domainData/SLOT/SET_SLOT',
    setSlotView = 'domainData/SLOT/SET_SLOT_VIEW',
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

// REDUCER

const setSlotData = (state: DomainData, action: { data: SlotData }) => {
    const { data } = action;
    const settings = {
        workspace: {
            timeslot: {
                [data.date]: { $auto: {
                    [data.id]: { $set: data },
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
            // FIXME: no need to use $auto here?
            [params.data.id]: { $set: params },
        },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<DomainData> = {
    [SLOT_DATA_ACTION.setSlot]: setSlotData,
    [SLOT_DATA_ACTION.setSlotView]: setSlotViewData,
};

export default reducer;
