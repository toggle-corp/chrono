import update from '../../../vendor/react-store/utils/immutable-update';
import { getObjectChildren } from '../../../vendor/react-store/utils/common';

import {
    DomainData,
    ReducerGroup,
    UserGroup,
    Users,
    Project,
    SetUserGroupAction,
    SetUserGroupProjectsAction,
    UnsetUserGroupProjectAction,
    UnsetUserGroupMemberAction,
    SetUserGroupMemberAction,
    PatchUserGroupAction,
} from '../../interface';

// ACTION-TYPE

export const enum USERGROUP_ACTION {
    setUserGroups = 'domainData/USERGROUP/SET_USERGROUPS',
    setUserGroup = 'domainData/USERGROUP/SET_USERGROUP',
    patchUserGroup = 'domainData/USERGROUP/PATCH_USERGROUP',
    setUserGroupProjects = 'domainData/USERGROUP/SET_PROJECTS',
    setUserGroupMember = 'domainData/USERGROUP/SET_MEMBER',
    unsetUserGroupProject = 'domainData/USERGROUP/UNSET-PROJECT',
    unsetUserGroupMember = 'domainData/USERGROUP/UNSET-MEMBER',
}

// ACTION-CREATOR

export const setUserGroupsAction = (userGroups: UserGroup[]) => ({
    userGroups,
    type: USERGROUP_ACTION.setUserGroups,
});

export const setUserGroupAction = ({ userId, userGroup }: SetUserGroupAction) => ({
    userId,
    userGroup,
    type: USERGROUP_ACTION.setUserGroup,
});

export const patchUserGroupAction = ({ userGroupId, userGroup }: PatchUserGroupAction) => ({
    userGroupId,
    userGroup,
    type: USERGROUP_ACTION.patchUserGroup,
});

export const setUserGroupProjectsAction = (
    { userGroupId, projects }: SetUserGroupProjectsAction) => ({
        userGroupId,
        projects,
        type: USERGROUP_ACTION.setUserGroupProjects,
    });

export const unsetUserGroupProjectAction = ({ projectId } : UnsetUserGroupProjectAction) => ({
    projectId,
    type: USERGROUP_ACTION.unsetUserGroupProject,
});

export const setUserGroupMemberAction = ({ userGroupId, member } : SetUserGroupMemberAction) => ({
    userGroupId,
    member,
    type: USERGROUP_ACTION.setUserGroupMember,
});

export const unsetUserGroupMemberAction = (
    { userGroupId, memberId } : UnsetUserGroupMemberAction) => ({
        userGroupId,
        memberId,
        type: USERGROUP_ACTION.unsetUserGroupMember,
    });

// HELPER

const findIndexOfUserGroupOfUser = (
    users: Users, userId: number | undefined, userGroupId: number,
) => {
    // XXX: getObjectChildren is unsafe
    const userGroups: UserGroup[] = getObjectChildren(users, [userId, 'userGroups']) || [];
    return userGroups.findIndex(userGroup => userGroup.id === userGroupId);
};

// REDUCER

const setUserGroups = (state: DomainData, action: { userGroups: UserGroup[] }) => {
    const { userGroups } = action;
    const settings = {
        userGroups: {
            $auto: {
                $set: userGroups,
            },
        },
    };
    return update(state, settings);
};

const setUserGroup = (state: DomainData, action: SetUserGroupAction) => {
    const { userId, userGroup } = action;
    const { users, userGroups } = state;
    const userGroupIndex = userGroups.findIndex(uG => uG.id === userGroup.id);

    const userUserGroupIndex = findIndexOfUserGroupOfUser(users, userId, userGroup.id);

    const settings = {
        userGroups: { $autoArray: {
            $if: [
                userGroupIndex === -1,
                { $push: [userGroup] },
                { [userGroupIndex]: { $set: userGroup } },
            ],
        } },
        users: {
            // NOTE: $if will handle the userId undefined
            [userId || 0]: { $auto: {
                userGroups: { $autoArray: {
                    $if: [
                        userUserGroupIndex === -1,
                        { $push: [userGroup] },
                        { [userUserGroupIndex]: { $set: userGroup } },
                    ],
                } },
            } },
        },
    };
    return update(state, settings);
};

const patchUserGroup = (state: DomainData, action: PatchUserGroupAction) => {
    const { userGroupId, userGroup } = action;
    const { userGroups } = state;
    const index = userGroups.findIndex(userGroup => userGroup.id === userGroupId);
    if (index === -1) {
        return state;
    }

    const settings = {
        userGroups: {
            $splice: [[index, 1, userGroup]],
        },
    };
    return update(state, settings);
};

const setUserGroupProjects = (state: DomainData, action: SetUserGroupProjectsAction) => {
    const{
        userGroupId,
        projects: userGroupProjects,
    } = action;

    const settings = {
        projects: {
            $bulk: [
                { $filter: ((project: Project) => project.userGroup !== userGroupId) },
                { $push: userGroupProjects },
            ],
        },
    };

    return update(state, settings);
};

const unsetUserGroupProject = (state: DomainData, action: UnsetUserGroupProjectAction) => {
    const { projectId } = action;
    const {
        projects,
    } = state;

    const index = projects.findIndex(p => (p.id === projectId));
    if (index === -1) {
        return state;
    }

    const settings = {
        projects: {
            $splice: [[index, 1]],
        },
    };

    return update(state, settings);
};

const setUserGroupMember = (state: DomainData, action: SetUserGroupMemberAction) => {
    const { userGroups } = state;
    const {
        userGroupId,
        member,
    } = action;

    const userGroupIndex = userGroups.findIndex(
        u => u.id === userGroupId,
    );
    if (userGroupIndex === -1) {
        return state;
    }

    const settings = {
        userGroups: {
            [userGroupIndex]: {
                memberships: {
                    $push: [member],
                },
            },
        },
    };
    return update(state, settings);
};

const unsetUserGroupMember = (state: DomainData, action: UnsetUserGroupMemberAction) => {
    const { userGroups } = state;
    const {
        userGroupId,
        memberId,
    } = action;

    const userGroupIndex = userGroups.findIndex(
        u => u.id === userGroupId,
    );
    if (userGroupIndex === -1) {
        return state;
    }

    const userGroup = userGroups[userGroupIndex];
    if (!userGroup.memberships) {
        return state;
    }

    const memberIndex = userGroup.memberships.findIndex(
        m => m.id === memberId,
    );
    if (memberIndex === -1) {
        return state;
    }

    const settings = {
        userGroups: {
            [userGroupIndex]: {
                memberships: {
                    $splice: [[memberIndex, 1]],
                },
            },
        },
    };

    return update(state, settings);
};

const reducer: ReducerGroup<DomainData> = {
    [USERGROUP_ACTION.setUserGroups]: setUserGroups,
    [USERGROUP_ACTION.setUserGroup]: setUserGroup,
    [USERGROUP_ACTION.patchUserGroup]: patchUserGroup,
    [USERGROUP_ACTION.setUserGroupProjects]: setUserGroupProjects,
    [USERGROUP_ACTION.unsetUserGroupProject]: unsetUserGroupProject,
    [USERGROUP_ACTION.setUserGroupMember]: setUserGroupMember,
    [USERGROUP_ACTION.unsetUserGroupMember]: unsetUserGroupMember,
};

export default reducer;
