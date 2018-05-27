import update from '../../../vendor/react-store/utils/immutable-update';
import { getObjectChildren } from '../../../vendor/react-store/utils/common';

import {
    DomainData,
    ReducerGroup,
    UserGroup,
    Users,
    SetUserGroupAction,
    UnsetUserGroupProjectAction,
    UnsetUserGroupMemberAction,
} from '../../interface';

// ACTION-TYPE

export const enum USERGROUP_ACTION {
    setUserGroups = 'domainData/USERGROUP/SET_USERGROUPS',
    setUserGroup = 'domainData/USERGROUP/SET_USERGROUP',
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

export const unsetUserGroupProjectAction = ({ projectId } : UnsetUserGroupProjectAction) => ({
    projectId,
    type: USERGROUP_ACTION.unsetUserGroupProject,
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

const removeUserGroupProject = (state: DomainData, action: UnsetUserGroupProjectAction) => {
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

const removeUserGroupMember = (state: DomainData, action: UnsetUserGroupMemberAction) => {
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
    [USERGROUP_ACTION.unsetUserGroupProject]: removeUserGroupProject,
    [USERGROUP_ACTION.unsetUserGroupMember]: removeUserGroupMember,
};

export default reducer;
