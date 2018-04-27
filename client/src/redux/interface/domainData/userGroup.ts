export interface UserGroup {
    id: number;
    title: string;
}

export interface SetUserGroupAction {
    userId?: number;
    userGroup: UserGroup;
}
