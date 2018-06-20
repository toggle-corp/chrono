import update from '../../../vendor/react-store/utils/immutable-update';

import {
    SiloDomainData,
    ReducerGroup,

    UnsetUserUserGroupAction,
    UnsetUserProjectAction,
    SetUserAction,
} from '../../interface';

const emptyObject = {};

// ACTION-TYPE

export const enum SILO_USER_PROFILE_ACTION {
    setUser = 'siloDomainData/USER/SET_USER',
    unsetUserGroup = 'siloDomainData/USER/UNSET_USERGROUP',
    unsetProject = 'siloDomainData/USER/UNSET_PROJECT',
}

// ACTION-CREATOR

export const setUserAction = (
    { userId, information, userGroups, projects }: SetUserAction,
) => ({
    userId,
    information,
    userGroups,
    projects,
    type: SILO_USER_PROFILE_ACTION.setUser,
});

export const unsetUserUserGroupAction = (
    { userId, userGroup }: UnsetUserUserGroupAction,
) => ({
    userId,
    userGroup,
    type: SILO_USER_PROFILE_ACTION.unsetUserGroup,
});

export const unsetUserProjectAction = (
    { userId, project }: UnsetUserProjectAction,
) => ({
    userId,
    project,
    type: SILO_USER_PROFILE_ACTION.unsetProject,
});

// REDUCER

const setUser = (state: SiloDomainData, action: SetUserAction) => {
    const { userId, information, userGroups, projects } = action;

    const settings = {
        users: {
            [userId]: { $auto: {
                information: {
                    $if: [
                        information,
                        { $set: information },
                    ],
                },
                userGroups: {
                    $if: [
                        userGroups,
                        { $set: userGroups },
                    ],
                },
                projects: {
                    $if: [
                        projects,
                        { $set: projects },
                    ],
                },
            } },
        },
    };
    return update(state, settings);
};

const usetUserUserGroup = (state: SiloDomainData, action: UnsetUserUserGroupAction) => {
    const { userId, userGroup } = action;

    const { users } = state;
    const { userGroups } = users[userId] || emptyObject;

    const userGroupIndex = userGroups.findIndex(userG => userG.id === userGroup.id);
    if (userGroupIndex === -1) {
        return state;
    }

    const settings = {
        users: {
            [userId]: { $auto: {
                userGroups: {
                    $splice: [[userGroupIndex, 1]],
                },
            } },
        },
    };
    return update(state, settings);
};

const usetUserProject = (state: SiloDomainData, action: UnsetUserProjectAction) => {
    const { userId, project } = action;

    const { users } = state;
    const { projects } = users[userId] || emptyObject;

    const projectIndex = projects.findIndex(p => p.id === project.id);
    if (projectIndex === -1) {
        return state;
    }

    const settings = {
        users: {
            [userId]: { $auto: {
                projects: {
                    $splice: [[projectIndex, 1]],
                },
            } },
        },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<SiloDomainData> = {
    [SILO_USER_PROFILE_ACTION.setUser]: setUser,
    [SILO_USER_PROFILE_ACTION.unsetUserGroup]: usetUserUserGroup,
    [SILO_USER_PROFILE_ACTION.unsetProject]: usetUserProject,
};

export default reducer;
