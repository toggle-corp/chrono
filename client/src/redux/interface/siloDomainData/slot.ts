import { FaramErrors } from '../../../vendor/react-store/components/General/Faram';

export interface TimeSlot {
    id: number;
    versionId?: number;
    date: string;
    startTime: string;
    endTime: string;
    task: number;
    userGroup: number;
    project: number;
    remarks: string;
}

export interface WipTimeSlot {
    id?: number;
    versionId?: number;
    tid: string;
    faramValues: {
        startTime?: string,
        endTime?: string,
        remarks?: string,
        userGroup?: number,
        project?: number,
        task?: number,
        tags?: number[],
    };
    faramErrors: FaramErrors;
    pristine: boolean;
    hasError: boolean;
    hasServerError: boolean;
}

export interface TimeSlots<T> {
    [key: string]: {
        [key: number]: T,
    };
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
