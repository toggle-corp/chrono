import update from '../../vendor/react-store/utils/immutable-update';
import { analyzeErrors } from '../../vendor/react-store/components/Input/Faram/validator';
import { randomString } from '../../vendor/react-store/utils/common';
import createReducerWithMap from '../../utils/createReducerWithMap';
import { getCanonicalDate, getWeekDayNumber } from '../../utils/map';

import initialSiloDomainData from '../initial-state/siloDomainData';
import { SiloDomainData, TimeSlot, ReducerGroup, WipTimeSlot } from '../interface';

// ACTION-TYPE

export const enum TIME_SLOT_ACTION {
    setActiveSlot = 'siloDomainData/SET_ACTIVE_SLOT',
    setTimeSlots = 'siloDomainData/SET_TIME_SLOTS',
    changeTimeSlot = 'siloDomainData/CHANGE_TIME_SLOT',
    saveTimeSlot = 'siloDomainData/SAVE_TIME_SLOT',
}

// ACTION-CREATOR INTERFACE

export interface SetActiveSlotAction  {
    year: number;
    month: number;
    day: number;
    timeSlotId?: number;
}

export interface SetTimeSlotsAction {
    timeSlots: TimeSlot[];
}

export interface ChangeTimeSlotAction {
    faramValues?: WipTimeSlot['faramValues'];
    faramErrors: WipTimeSlot['faramErrors'];
}

export interface SaveTimeSlotAction {
    timeSlot: TimeSlot;
}

// ACTION-CREATOR

export const setActiveSlotAction = ({ year, month, day, timeSlotId }: SetActiveSlotAction) => ({
    year,
    month,
    day,
    timeSlotId,
    type: TIME_SLOT_ACTION.setActiveSlot,
});

export const setTimeSlotsAction = ({ timeSlots }: SetTimeSlotsAction) => ({
    timeSlots,
    type: TIME_SLOT_ACTION.setTimeSlots,
});

export const changeTimeSlotAction = ({ faramValues, faramErrors }: ChangeTimeSlotAction) => ({
    faramValues,
    faramErrors,
    type: TIME_SLOT_ACTION.changeTimeSlot,
});

export const saveTimeSlotAction = ({ timeSlot }: SaveTimeSlotAction) => ({
    timeSlot,
    type: TIME_SLOT_ACTION.saveTimeSlot,
});

// REDUCER

const setActiveSlot = (
    state: SiloDomainData,
    action: SetActiveSlotAction & { type: string },
) => {
    const { year, month, day, timeSlotId } = action;
    const { workspace: { timeSlots, wipTimeSlots } } = state;

    const canonicalDate = getCanonicalDate(year, month, day);

    let faramValues: WipTimeSlot['faramValues'] = {};
    if (
        timeSlotId &&
        timeSlots[canonicalDate] &&
        timeSlots[canonicalDate][timeSlotId]
    ) {
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

    const weekDay = year && month && day
        ? getWeekDayNumber(year, month, day)
        : undefined;

    const wipExists = !!(
        wipTimeSlots[canonicalDate] &&
        wipTimeSlots[canonicalDate][timeSlotId || 0]
    );

    const settings = {
        workspace: {
            activeDate: {
                year: { $set: year },
                month: { $set: month },
                day: { $set: day },
                weekDay: { $set: weekDay },
            },
            activeTimeSlotId: { $set: timeSlotId },
            $if: [
                !wipExists,
                {
                    wipTimeSlots: {
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
            ],
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

const changeTimeSlot = (
    state: SiloDomainData,
    action: ChangeTimeSlotAction & { type: string },
) => {
    const { activeDate, activeTimeSlotId } = state.workspace;

    // at this point year, month, and day should be defined
    const { year, month, day } = activeDate as { year: number, month: number, day: number};
    const canonicalDate = getCanonicalDate(year, month, day);

    const hasError = analyzeErrors(action.faramErrors);

    const settings = {
        workspace: {
            wipTimeSlots: {
                [canonicalDate] : { $auto: {
                    [activeTimeSlotId || 0]: { $auto: {
                        hasError: { $set: hasError },
                        $if: [
                            action.faramValues !== undefined,
                            {
                                faramValues: { $set: action.faramValues },
                            },
                        ],
                        faramErrors: { $set: action.faramErrors },
                        pristine: { $set: false },
                        // hasServerError: false,
                    } },
                } },
            },
        },
    };
    return update(state, settings);
};

const saveTimeSlot = (
    state: SiloDomainData,
    action: SaveTimeSlotAction & { type: string },
) => {
    const { timeSlot } = action;

    const faramValues: WipTimeSlot['faramValues'] = {
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

    const settings = {
        workspace: {
            activeTimeSlotId: { $set: timeSlot.id },
            timeSlots: {
                [timeSlot.date] : { $auto: {
                    [timeSlot.id]: { $auto: {
                        $set: timeSlot,
                    } },
                } },
            },
            wipTimeSlots: {
                [timeSlot.date] : { $auto: {
                    0: { $set: undefined },
                    [timeSlot.id]: { $auto: {
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

export const siloDomainDataReducers: ReducerGroup<SiloDomainData> = {
    [TIME_SLOT_ACTION.setActiveSlot]: setActiveSlot,
    [TIME_SLOT_ACTION.setTimeSlots]: setTimeSlots,
    [TIME_SLOT_ACTION.changeTimeSlot]: changeTimeSlot,
    [TIME_SLOT_ACTION.saveTimeSlot]: saveTimeSlot,
};
export default createReducerWithMap(siloDomainDataReducers, initialSiloDomainData);
