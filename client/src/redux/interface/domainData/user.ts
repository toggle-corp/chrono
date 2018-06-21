export interface UserPartialInformation {
    id: number;
    email: string;
    displayName: string;
}

export interface SetUsersAction {
    users: UserPartialInformation[];
}
