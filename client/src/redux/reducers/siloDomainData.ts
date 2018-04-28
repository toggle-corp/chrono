import update from '../../vendor/react-store/utils/immutable-update';
import { randomString } from '../../vendor/react-store/utils/common';
import createReducerWithMap from '../../utils/createReducerWithMap';
import { getCanonicalDate, getWeekDayNumber } from '../../utils/map';

import initialSiloDomainData from '../initial-state/siloDomainData';
import { SiloDomainData, TimeSlot, ReducerGroup } from '../interface';

// ACTION-TYPE

export const enum TIME_SLOT_ACTION {
    setActiveSlot = 'siloDomainData/SET_ACTIVE_SLOT',
    setTimeSlots = 'siloDomainData/SET_TIME_SLOTS',
}

export interface SetActiveSlotAction  {
    year: number;
    month: number;
    day: number;
    timeSlotId?: number;
}

export interface SetTimeSlotsAction {
    timeSlots: TimeSlot[];
}

// ACTION-CREATOR

export const setActiveSlotAction = ({ year, month, day, timeSlotId } : SetActiveSlotAction) => ({
    year,
    month,
    day,
    timeSlotId,
    type: TIME_SLOT_ACTION.setActiveSlot,
});

export const setTimeSlotsAction = ({ timeSlots } : SetTimeSlotsAction) => ({
    timeSlots,
    type: TIME_SLOT_ACTION.setTimeSlots,
});

// REDUCER

const setActiveSlot = (
    state: SiloDomainData,
    action: SetActiveSlotAction & { type: string },
) => {
    const { year, month, day, timeSlotId } = action;
    const { workspace: { timeSlots } } = state;

    const canonicalDate = getCanonicalDate(year, month, day);
    let faramValues = {};
    if (timeSlotId && timeSlots[canonicalDate] && timeSlots[canonicalDate][timeSlotId]) {
        const timeSlot = timeSlots[canonicalDate][timeSlotId];
        faramValues = {
            /*
            // TODO: get these values from server
            userGroup:
            project:
            task:
            */
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
            remarks: timeSlot.remarks,
        };
    }

    const weekDay = year && month && day ? getWeekDayNumber(year, month, day) : undefined;

    const settings = {
        workspace: {
            activeDate: {
                year: { $set: year },
                month: { $set: month },
                day: { $set: day },
                weekDay: { $set: weekDay },
            },
            activeTimeslotId: { $set: timeSlotId },
            wipTimeSlots: {
                // TODO: no action if a wip already exists
                [canonicalDate] : { $auto: {
                    [timeSlotId || 0]: { $auto: {
                        $set: {
                            faramValues,
                            tid: randomString(),
                            faramErrors:{},
                            pristine: true,
                            hasError: false,
                            hasServerError: false,
                        },
                    } },
                } },
            },
        },
    };
    return update(state, settings);
};

const setTimeSlots = (
    state: SiloDomainData,
    action: SetTimeSlotsAction & { type: string },
) => {
    const { timeSlots } = action;

    const newTimeSlots = timeSlots.reduce(
        (acc, value) => {
            const groupOneKey = value.date;
            const groupTwoKey = value.id;

            if (acc[groupOneKey]) {
                acc[groupOneKey][groupTwoKey] = value;
            } else {
                acc[groupOneKey] = { [groupTwoKey]: value };
            }
            return acc;
        },
        {},
    );

    const settings = {
        workspace: {
            timeSlots: {
                $set: newTimeSlots,
            },
        },
    };
    return update(state, settings);
};

export const siloDomainDataReducers: ReducerGroup<SiloDomainData> = {
    [TIME_SLOT_ACTION.setActiveSlot]: setActiveSlot,
    [TIME_SLOT_ACTION.setTimeSlots]: setTimeSlots,
};
export default createReducerWithMap(siloDomainDataReducers, initialSiloDomainData);
