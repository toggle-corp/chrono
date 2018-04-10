import update from '../../vendor/react-store/utils/immutable-update';
import { getObjectChildren } from '../../vendor/react-store/utils/common';
import createReducerWithMap from '../../utils/createReducerWithMap';

import {
    DomainData,
    ReducerGroup,
    UserGroup,
    Users,

    SetUserGroupAction,
} from '../interface';
import initialDominDataState from '../initial-state/domainData';

// ACTION-TYPE

export const enum USERGROUP_ACTION {
    setUserGroups = 'domainData/SET_USERGROUPS',
    setUserGroup = 'domainData/SET_USERGROUP',
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

// HELPER

const findIndexOfUserGroupOfUser = (
    users: Users, userId: number | undefined, userGroupId: number,
) => {
    const userGroups: UserGroup[] = getObjectChildren(users, [userId, 'userGroups'], []);
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

export const userGroupReducer: ReducerGroup<DomainData> = {
    [USERGROUP_ACTION.setUserGroups]: setUserGroups,
    [USERGROUP_ACTION.setUserGroup]: setUserGroup,
};

export default createReducerWithMap(userGroupReducer, initialDominDataState);
