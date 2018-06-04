import { FaramErrors } from '../../../vendor/react-store/components/Input/Faram';

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

export interface Ymd {
    year?: number;
    month?: number;
    day?: number;
}

export interface WorkspaceView {
    activeDate: Ymd;
    activeTimeSlotId?: number;
    wipTimeSlots: TimeSlots<WipTimeSlot>;
    timeSlots: TimeSlots<TimeSlot>;
}

export interface SiloDomainData {
    workspace: WorkspaceView;
}
