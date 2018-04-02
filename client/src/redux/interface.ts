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
export interface DayData {
    [key: number]: {
        // FIXME: fix the types
        startTime: string,
        endTime: string,
        userGroup: number,
        project: number,
        task: number,
        remarks: string,
    };
}

export interface UserGroup {
    id: number;
    title: string;
}

export interface DomainData {
    activeDay: number;
    dayData: DayData;
    userGroups: UserGroup[];
}

export interface RootState {
    domainData: DomainData;
    auth: Auth;
}

export interface ReducerGroup<T> {
    [key: string]: ((state: T, action: object) => T);
}
