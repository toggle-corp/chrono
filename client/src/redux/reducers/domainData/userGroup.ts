import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,
    UserGroup,
} from '../../interface';

// ACTION-TYPE

export const enum USERGROUP_ACTION {
    setUserGroups = 'domainData/USERGROUP/SET_USERGROUPS',
}

// ACTION-CREATOR

export const setUserGroupsAction = (userGroups: UserGroup[]) => ({
    userGroups,
    type: USERGROUP_ACTION.setUserGroups,
});

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

const reducer: ReducerGroup<DomainData> = {
    [USERGROUP_ACTION.setUserGroups]: setUserGroups,
};

export default reducer;
