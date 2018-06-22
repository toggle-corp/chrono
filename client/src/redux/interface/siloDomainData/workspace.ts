import {
    Ymd,
    TimeSlots,
    WipTimeSlot,
    TimeSlot,
} from '../../interface';

export interface WorkspaceView {
    activeDate: Partial<Ymd>;
    activeTimeSlotId?: number;
    wipTimeSlots: TimeSlots<WipTimeSlot>;
    timeSlots: TimeSlots<TimeSlot>;
}
