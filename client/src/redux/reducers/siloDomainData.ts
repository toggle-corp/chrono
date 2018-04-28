import update from '../../vendor/react-store/utils/immutable-update';
import { isFalsy, randomString } from '../../vendor/react-store/utils/common';
import createReducerWithMap from '../../utils/createReducerWithMap';

import initialSiloDomainData from '../initial-state/siloDomainData';
import { SiloDomainData, ReducerGroup } from '../interface';

// ACTION-TYPE

export const enum TIME_SLOT_ACTION {
    setActiveSlot = 'siloDomainData/SET_ACTIVE_SLOT',
}

export interface SetActiveSlotAction  {
    year: number;
    month: number;
    day: number;
    timeSlotId?: number;
}

// ACTION-CREATOR

export const setActiveSlotAction = ({ year, month, day, timeSlotId } : SetActiveSlotAction) => ({
    year,
    month,
    day,
    timeSlotId,
    type: TIME_SLOT_ACTION.setActiveSlot,
});

// REDUCER

const setActiveSlot = (
    state: SiloDomainData,
    action: SetActiveSlotAction & { type: string },
) => {
    const { year, month, day, timeSlotId } = action;
    const settings = {
        workspace: {
            activeDate: {
                year: { $set: year },
                month: { $set: month },
                day: { $set: day },
            },
            activeTimeslotId: { $set: timeSlotId },
            wipTimeSlots: {
                // TODO: no action if a wip already exists
                // else copy from timeslot or create a fresh
                $if: [
                    isFalsy(timeSlotId),
                    {
                        [`${year}-${month}-${day}`] : { $auto: {
                            0: { $auto: {
                                $set: {
                                    tid: randomString(),
                                    faramValues: {},
                                    faramErrors:{},
                                    pristine: true,
                                    hasError: false,
                                    hasServerError: false,
                                },
                            } },
                        } },
                    },
                ],
            },
        },
    };
    return update(state, settings);
};

export const siloDomainDataReducers: ReducerGroup<SiloDomainData> = {
    [TIME_SLOT_ACTION.setActiveSlot]: setActiveSlot,
};
export default createReducerWithMap(siloDomainDataReducers, initialSiloDomainData);
