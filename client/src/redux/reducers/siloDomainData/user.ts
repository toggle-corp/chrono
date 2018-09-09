import update from '#rsu/immutable-update';

import {
    SiloDomainData,
    ReducerGroup,
    UserGroup,
    Project,

    UnsetUserUserGroupAction,
    UnsetUserProjectAction,
    SetUserAction,
} from '../../interface';

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
                $mergeIfDefined: {
                    information,
                    userGroups,
                    projects,
                },
            } },
        },
    };
    return update(state, settings);
};

const unsetUserUserGroup = (state: SiloDomainData, action: UnsetUserUserGroupAction) => {
    const { userId, userGroup } = action;
    const settings = {
        users: {
            [userId]: { $auto: {
                userGroups: {
                    $filter: (ug: UserGroup) => ug.id !== userGroup.id,
                },
            } },
        },
    };
    return update(state, settings);
};

const usetUserProject = (state: SiloDomainData, action: UnsetUserProjectAction) => {
    const { userId, project } = action;
    const settings = {
        users: {
            [userId]: { $auto: {
                projects: {
                    $filter: (p: Project) => p.id !== project.id,
                },
            } },
        },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<SiloDomainData> = {
    [SILO_USER_PROFILE_ACTION.setUser]: setUser,
    [SILO_USER_PROFILE_ACTION.unsetUserGroup]: unsetUserUserGroup,
    [SILO_USER_PROFILE_ACTION.unsetProject]: usetUserProject,
};

export default reducer;
