import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,
    SetUsersAction,
} from '../../interface';

// ACTION-TYPE

export const enum USER_ACTION {
    setUsers = 'domainData/USER/SET_USERS',
}

// ACTION-CREATOR

export const setUsersAction = (
    { users }: SetUsersAction,
) => ({
    users,
    type: USER_ACTION.setUsers,
});

// REDUCER

const setUsers = (state: DomainData, action: SetUsersAction) => {
    const { users } = action;

    const settings = {
        users: { $autoArray : {
            $set: users,
        } },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<DomainData> = {
    [USER_ACTION.setUsers]: setUsers,
};

export default reducer;
