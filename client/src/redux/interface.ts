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

export interface UserGroup {
    id: number;
    title: string;
}

export interface DomainData {
    activeDay: number;
    userGroups: UserGroup[];
    slotData: SlotData;
}

export interface RootState {
    domainData: DomainData;
    auth: Auth;
}

export interface ReducerGroup<T> {
    [key: string]: ((state: T, action: object) => T);
}
