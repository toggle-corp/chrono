import {
    FormErrors,
    FormFieldErrors,
} from '../../rest/interface';
import { SlotData } from './slot';

export interface TimeslotView {
    data: SlotData;
    pristine: boolean;
    formErrors: FormErrors;
    formFieldErrors: FormFieldErrors;
}

export interface TimeslotViews {
    [key: number]: TimeslotView;
}

export interface Workspace {
    active: {
        date: string;
        slot: {
            [key: string]: number;
        };
    };
    timeslot: {
        [key: string]: {
            [key: number]: SlotData;
        };
    };
}
