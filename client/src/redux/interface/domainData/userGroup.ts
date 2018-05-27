export interface Member {
    id: number;
    member: number;
    memberName: string;
    memberEmail: string;
    group: number;
    role: string;
    joinedAt: string;
}

export interface UserGroup {
    id: number;
    title?: string;
    description?: string;
    memberships?: Member[];
}

export interface UserGroupProject {
    id: number;
}

// ACTION INTERFACE

export interface SetUserGroupAction {
    userId?: number;
    userGroup: UserGroup;
}

export interface UnsetUserGroupMemberAction {
    userGroupId?: number;
    memberId: number;
}

export interface UnsetUserGroupProjectAction {
    projectId: number;
}
