import update from '../../../vendor/react-store/utils/immutable-update';
import { getObjectChildren } from '../../../vendor/react-store/utils/common';

import {
    SiloDomainData,
    ReducerGroup,
    UserGroup,
    UserGroups,
    Member,
    Users,
    SetUserGroupAction,
    SetUserGroupProjectsAction,
    UnsetUserGroupProjectAction,
    UnsetUserGroupMemberAction,
    SetUserGroupMemberAction,
    PatchUserGroupAction,
} from '../../interface';

// ACTION-TYPE

export const enum SILO_USERGROUP_ACTION {
    setUserGroup = 'siloDomainData/USERGROUP/SET_USERGROUP',
    patchUserGroup = 'siloDomainData/USERGROUP/PATCH_USERGROUP',
    setUserGroupProjects = 'siloDomainData/USERGROUP/SET_PROJECTS',
    setUserGroupMember = 'siloDomainData/USERGROUP/SET_MEMBER',
    unsetUserGroupProject = 'siloDomainData/USERGROUP/UNSET_PROJECT',
    unsetUserGroupMember = 'siloDomainData/USERGROUP/UNSET_MEMBER',
}

// HELPER

const findIndexOfMemberOfUserGroup = (
    userGroups: UserGroups,
    userGroupId: number | undefined,
    memberId: number,
) => {
    const members: Member[] = getObjectChildren(userGroups, [userGroupId, 'memberships']) || [];
    return members.findIndex(member => member.id === memberId);
};
// ACTION-CREATOR

export const setUserGroupAction = ({ userId, userGroup }: SetUserGroupAction) => ({
    userId,
    userGroup,
    type: SILO_USERGROUP_ACTION.setUserGroup,
});

export const patchUserGroupAction = ({ userGroupId, userGroup }: PatchUserGroupAction) => ({
    userGroupId,
    userGroup,
    type: SILO_USERGROUP_ACTION.patchUserGroup,
});

export const setUserGroupProjectsAction = (
    { userGroupId, projects }: SetUserGroupProjectsAction) => ({
        userGroupId,
        projects,
        type: SILO_USERGROUP_ACTION.setUserGroupProjects,
    });

export const unsetUserGroupProjectAction = ({ projectId } : UnsetUserGroupProjectAction) => ({
    projectId,
    type: SILO_USERGROUP_ACTION.unsetUserGroupProject,
});

export const setUserGroupMemberAction = ({ userGroupId, member } : SetUserGroupMemberAction) => ({
    userGroupId,
    member,
    type: SILO_USERGROUP_ACTION.setUserGroupMember,
});

export const unsetUserGroupMemberAction = (
    { userGroupId, memberId } : UnsetUserGroupMemberAction) => ({
        userGroupId,
        memberId,
        type: SILO_USERGROUP_ACTION.unsetUserGroupMember,
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

const setUserGroup = (state: SiloDomainData, action: SetUserGroupAction) => {
    const { userId, userGroup } = action;
    const { users } = state;

    const userUserGroupIndex = findIndexOfUserGroupOfUser(users, userId, userGroup.id);

    const settings = {
        userGroups: { $auto: {
            [userGroup.id]: {
                $set: userGroup,
            },
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

const patchUserGroup = (state: SiloDomainData, action: PatchUserGroupAction) => {
    const { userGroupId, userGroup } = action;

    const settings = {
        userGroups: { $auto: {
            [userGroupId]: {
                $set: userGroup,
            },
        } },
    };
    return update(state, settings);
};

const setUserGroupProjects = (state: SiloDomainData, action: SetUserGroupProjectsAction) => {
    const{ projects } = action;

    const userGroupProjects = projects.reduce(
        (acc, project) => {
            acc[project.id] = {
                $set: project,
            };
            return acc;
        },
        {},
    );
    const settings = { projects: userGroupProjects };

    return update(state, settings);
};

const unsetUserGroupProject = (state: SiloDomainData, action: UnsetUserGroupProjectAction) => {
    const { projectId } = action;

    const settings = {
        projects: { $auto: {
            [projectId]: {
                $set: undefined,
            },
        } },
    };

    return update(state, settings);
};

const setUserGroupMember = (state: SiloDomainData, action: SetUserGroupMemberAction) => {
    const {
        userGroupId,
        member,
    } = action;

    const settings = {
        userGroups: {
            [userGroupId]: { $auto: {
                memberships: { $autoArray: {
                    $push: [member],
                } },
            } },
        },
    };
    return update(state, settings);
};

const unsetUserGroupMember = (state: SiloDomainData, action: UnsetUserGroupMemberAction) => {
    const { userGroups } = state;
    const {
        userGroupId,
        memberId,
    } = action;

    const memberIndex = findIndexOfMemberOfUserGroup(userGroups, userGroupId, memberId);

    // FIXME: use $filter
    const settings = {
        userGroups: {
            [userGroupId]: {
                memberships: {
                    $if: [
                        memberIndex !== -1,
                        { $splice: [[memberIndex, 1]] },
                    ],
                },
            },
        },
    };

    return update(state, settings);
};

const reducer: ReducerGroup<SiloDomainData> = {
    [SILO_USERGROUP_ACTION.setUserGroup]: setUserGroup,
    [SILO_USERGROUP_ACTION.patchUserGroup]: patchUserGroup,
    [SILO_USERGROUP_ACTION.setUserGroupProjects]: setUserGroupProjects,
    [SILO_USERGROUP_ACTION.unsetUserGroupProject]: unsetUserGroupProject,
    [SILO_USERGROUP_ACTION.setUserGroupMember]: setUserGroupMember,
    [SILO_USERGROUP_ACTION.unsetUserGroupMember]: unsetUserGroupMember,
};

export default reducer;
