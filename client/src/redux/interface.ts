import {
    FormErrors,
    FormFieldErrors,
} from '../rest/interface';

export interface Notification {
    type: string;
    title: string;
    message: string;
    dismissable: boolean;
    duration: number;
}
export interface Token {
    access?: string;
    refresh?: string;
}
export interface ActiveUser {
    isSuperuser?: boolean;
    userId?: number;
    username?: string;
    displayName?: string;
    exp?: string;
}
export interface Auth {
    token: Token;
    activeUser: ActiveUser;
    authenticated: boolean;
}

export interface SlotData {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    user: number;
    task: number;
    remarks: string;
}

export type UserIdFromRoute = number;

export interface User {
    id: UserIdFromRoute;
    firstName: string;
    lastName: string;
    email: string;
    organization: string;
}

export interface Users {
    [key: string]: User;
}

export interface UserGroup {
    id: number;
    title: string;
}

export interface Project {
    id: number;
    title: string;
    userGroup: number;
    createdAt: string;
    modifiedAt: string;
    createdBy: number;
    modifiedBy: number;
    createdByName: string;
    modifiedByname: string;
    description: string;
}

export interface Task {
    id: number;
    createdAt: string;
    modifiedAt: string;
    createdBy: number;
    modifiedBy: number;
    createdByName: string;
    modifiedByName: string;
    title: string;
    description: string;
    project: number;
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

export interface TimeslotView {
    data: SlotData;
    pristine: boolean;
    formErrors: FormErrors;
    formFieldErrors: FormFieldErrors;
}

export interface TimeslotViews {
    [key: number]: TimeslotView;
}

export interface DomainData {
    activeDay: string;
    userGroups: UserGroup[];
    projects: Project[];
    tasks: Task[];
    slotData: SlotData;
    workspace: Workspace;
    timeslotViews: TimeslotViews;
    users: Users;
}

export interface Notify {
    notifications: Notification[];
}

export interface RootState {
    domainData: DomainData;
    auth: Auth;
    notify: Notify;
}

export interface ReducerGroup<T> {
    [key: string]: ((state: T, action: object) => T);
}
