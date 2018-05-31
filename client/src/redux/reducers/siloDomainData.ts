import update from '../../vendor/react-store/utils/immutable-update';
import { analyzeErrors } from '../../vendor/react-store/components/Input/Faram/validator';
import { randomString } from '../../vendor/react-store/utils/common';
import createReducerWithMap from '../../utils/createReducerWithMap';
import { getCanonicalDate } from '../../utils/map';

import initialSiloDomainData from '../initial-state/siloDomainData';
import { SiloDomainData, TimeSlot, ReducerGroup, WipTimeSlot } from '../interface';

// ACTION-TYPE

export const enum TIME_SLOT_ACTION {
    setActiveSlot = 'siloDomainData/SET_ACTIVE_SLOT',
    setTimeSlots = 'siloDomainData/SET_TIME_SLOTS',
    changeTimeSlot = 'siloDomainData/CHANGE_TIME_SLOT',
    saveTimeSlot = 'siloDomainData/SAVE_TIME_SLOT',
    discardTimeSlot = 'siloDomainData/DISCARD_TIME_SLOT',
}

// HELPER

const getFaramValuesFromTimeSlot = (timeSlot: TimeSlot): WipTimeSlot['faramValues'] => ({
    startTime: timeSlot.startTime,
    endTime: timeSlot.endTime,
    remarks: timeSlot.remarks,
    task: timeSlot.task,
    userGroup: timeSlot.userGroup,
    project: timeSlot.project,
});

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

export const discardTimeSlotAction = () => ({
    type: TIME_SLOT_ACTION.discardTimeSlot,
});

// REDUCER

const setActiveSlot = (
    state: SiloDomainData,
    action: SetActiveSlotAction & { type: string },
) => {
    const { workspace: { timeSlots, wipTimeSlots } } = state;
    const { year, month, day, timeSlotId } = action;

    const canonicalDate = getCanonicalDate(year, month, day);

    const wipTimeSlotExists = !!(
        wipTimeSlots[canonicalDate] &&
        wipTimeSlots[canonicalDate][timeSlotId || 0]
    );

    const timeSlotExists = !!(
        timeSlotId &&
        timeSlots[canonicalDate] &&
        timeSlots[canonicalDate][timeSlotId]
    );

    const faramValues = timeSlotExists
        ? getFaramValuesFromTimeSlot(timeSlots[canonicalDate][timeSlotId as number])
        : {};

    const settings = {
        workspace: {
            activeDate: {
                year: { $set: year },
                month: { $set: month },
                day: { $set: day },
            },
            activeTimeSlotId: { $set: timeSlotId },
            $if: [
                !wipTimeSlotExists,
                {
                    wipTimeSlots: {
                        [canonicalDate] : { $auto: {
                            [timeSlotId || 0]: { $auto: {
                                $set: {
                                    faramValues,
                                    id: timeSlotId,
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
                        hasServerError: { $set: false }, // NOTE: set false for now
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

    const faramValues = getFaramValuesFromTimeSlot(timeSlot);

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
                            id: timeSlot.id,
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

const discardTimeSlot = (
    state: SiloDomainData,
    action: { type: string },
) => {
    const { workspace: { timeSlots, activeDate, activeTimeSlotId } } = state;
    const { year, month, day } = activeDate;

    const canonicalDate = getCanonicalDate(year as number, month as number, day as number);

    const timeSlotExists = !!(
        activeTimeSlotId &&
        timeSlots[canonicalDate] &&
        timeSlots[canonicalDate][activeTimeSlotId]
    );

    const faramValues = timeSlotExists
        ? getFaramValuesFromTimeSlot(timeSlots[canonicalDate][activeTimeSlotId as number])
        : {};

    const settings = {
        workspace: {
            wipTimeSlots: {
                [canonicalDate] : { $auto: {
                    [activeTimeSlotId || 0]: { $auto: {
                        $set: {
                            faramValues,
                            id: activeTimeSlotId,
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
    [TIME_SLOT_ACTION.discardTimeSlot]: discardTimeSlot,
};
export default createReducerWithMap(siloDomainDataReducers, initialSiloDomainData);
