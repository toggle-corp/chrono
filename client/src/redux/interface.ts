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
export interface RootState {
    domainData: object;
    auth: Auth;
}

export interface ReducerGroup<T> {
    [key: string]: ((state: T, action: object) => T);
}
