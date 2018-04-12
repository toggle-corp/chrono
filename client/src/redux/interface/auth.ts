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
