export interface TimeSlot {
    // FIXME: unknown
    id: number;
    versionId: number;
    date: string;
    startTime: string;
    endTime: string;
    user: number;
    task: number;
    remarks: string;
}

export interface WipTimeSlot {
    id?: number;
    versionId?: number;
    tid: string;
    faramValues: object;
    faramErrors: object;
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
    weekDay?: number;
}

export interface WorkspaceView {
    activeDate: Ymd;
    activeTimeslotId?: number;
    wipTimeSlots: TimeSlots<WipTimeSlot>;
    timeSlots: TimeSlots<TimeSlot>;
}

export interface SiloDomainData {
    workspace: WorkspaceView;
}
