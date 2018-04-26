import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,
    SlotData,
    TimeslotView,
} from '../../interface';

// ACTION-TYPE

export const enum SLOT_DATA_ACTION {
    setSlot = 'domainData/SET_SLOT',
    unsetSlot = 'domainData/UNSET_SLOT',
    setSlotView = 'domainData/SET_SLOT_VIEW',
}

// ACTION-CREATOR

export const setSlotAction = (data: SlotData) => ({
    data,
    type: SLOT_DATA_ACTION.setSlot,
});

export const unsetSlotAction = (slotId: number) => ({
    slotId,
    type: SLOT_DATA_ACTION.unsetSlot,
});

export const setSlotViewAction = (params: TimeslotView) => ({
    params,
    type: SLOT_DATA_ACTION.setSlotView,
});

// HELPER

// REDUCER
const setSlotData = (state: DomainData, action: { data: SlotData }) => {
    const { data } = action;
    const settings = {
        timeslotViews: {
            [data.id]: { $auto: {
                data: { $set: data },
                pristine: { $set: false },
                formErrors: { $set: {} },
                formFieldErrors: { $set: {} },
            } },
        },
        workspace: {
            timeslot: {
                [data.id]: {
                    $set: data,
                },
            },
        },
    };
    return update(state, settings);
};

const unsetSlotData = (state: DomainData, action: { slotId: number }) => {
    const { slotId } = action;
    const settings = {
        timeslotViews: {
            [slotId]: { $auto: {
                id: { $set: undefined },
            } },
        },
        workspace: {
            timeslot: {
                [slotId]: { $auto: {
                    $set: undefined,
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
            [params.id || 0]: {
                $set: params,
            },
        },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<DomainData> = {
    [SLOT_DATA_ACTION.setSlot]: setSlotData,
    [SLOT_DATA_ACTION.unsetSlot]: unsetSlotData,
    [SLOT_DATA_ACTION.setSlotView]: setSlotViewData,
};

export default reducer;
