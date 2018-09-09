import update from '#rsu/immutable-update';
import { analyzeErrors } from '#rscg/Faram/validator';
import { randomString } from '#rsu/common';
import { getCanonicalDate } from '../../../utils/map';

import {
    SiloDomainData,
    TimeSlot,
    ReducerGroup,
    WipTimeSlot,

    SetActiveSlotAction,
    SetTimeSlotsAction,
    ChangeTimeSlotAction,
    SaveTimeSlotAction,
} from '../../interface';

// ACTION-TYPE

export const enum SILO_TIME_SLOT_ACTION {
    setActiveSlot = 'siloDomainData/SLOT/SET_ACTIVE_SLOT',
    setTimeSlots = 'siloDomainData/SLOT/SET_TIME_SLOTS',
    changeTimeSlot = 'siloDomainData/SLOT/CHANGE_TIME_SLOT',
    saveTimeSlot = 'siloDomainData/SLOT/SAVE_TIME_SLOT',
    discardTimeSlot = 'siloDomainData/SLOT/DISCARD_TIME_SLOT',
    deleteTimeSlot = 'siloDomainData/SLOT/DELETE_TIME_SLOT',
}

// HELPER

const getFaramValuesFromTimeSlot = (timeSlot: TimeSlot): WipTimeSlot['faramValues'] => ({
    startTime: timeSlot.startTime,
    endTime: timeSlot.endTime,
    remarks: timeSlot.remarks,
    task: timeSlot.task,
    userGroup: timeSlot.userGroup,
    project: timeSlot.project,
    tags: timeSlot.tags,
});

// ACTION-CREATOR

export const setActiveSlotAction = ({ year, month, day, timeSlotId }: SetActiveSlotAction) => ({
    year,
    month,
    day,
    timeSlotId,
    type: SILO_TIME_SLOT_ACTION.setActiveSlot,
});

export const setTimeSlotsAction = ({ timeSlots }: SetTimeSlotsAction) => ({
    timeSlots,
    type: SILO_TIME_SLOT_ACTION.setTimeSlots,
});

export const changeTimeSlotAction = ({ faramValues, faramErrors }: ChangeTimeSlotAction) => ({
    faramValues,
    faramErrors,
    type: SILO_TIME_SLOT_ACTION.changeTimeSlot,
});

export const saveTimeSlotAction = ({ timeSlot }: SaveTimeSlotAction) => ({
    timeSlot,
    type: SILO_TIME_SLOT_ACTION.saveTimeSlot,
});

export const discardTimeSlotAction = () => ({
    type: SILO_TIME_SLOT_ACTION.discardTimeSlot,
});

export const deleteTimeSlotAction = () => ({
    type: SILO_TIME_SLOT_ACTION.deleteTimeSlot,
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

const deleteTimeSlot = (
    state: SiloDomainData,
) => {
    const { activeDate, activeTimeSlotId } = state.workspace;

    // at this point year, month, and day should be defined
    const { year, month, day } = activeDate as { year: number, month: number, day: number};

    const canonicalDate = getCanonicalDate(year, month, day);

    const settings = {
        workspace: {
            activeTimeSlotId: { $set: undefined },
            activeDate: {
                day: { $set: undefined },
            },
            timeSlots: {
                [canonicalDate]: {
                    $unset: [activeTimeSlotId],
                },
            },
            wipTimeSlots: {
                [canonicalDate]: {
                    $unset: [activeTimeSlotId],
                },
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
            activeDate: {
                day: { $set: undefined },
            },
            activeTimeSlotId: { $set: undefined },
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

const reducer: ReducerGroup<SiloDomainData> = {
    [SILO_TIME_SLOT_ACTION.setActiveSlot]: setActiveSlot,
    [SILO_TIME_SLOT_ACTION.setTimeSlots]: setTimeSlots,
    [SILO_TIME_SLOT_ACTION.changeTimeSlot]: changeTimeSlot,
    [SILO_TIME_SLOT_ACTION.saveTimeSlot]: saveTimeSlot,
    [SILO_TIME_SLOT_ACTION.discardTimeSlot]: discardTimeSlot,
    [SILO_TIME_SLOT_ACTION.deleteTimeSlot]: deleteTimeSlot,
};

export default reducer;
