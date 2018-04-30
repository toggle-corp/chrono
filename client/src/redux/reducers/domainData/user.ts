import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    UnsetUserUserGroupAction,
    UnsetUserProjectAction,
    SetUserAction,
} from '../../interface';

const emptyObject = {};

// ACTION-TYPE

export const enum USER_PROFILE_ACTION {
    setUser = 'domainData/USER/SET_USER',
    unsetUserGroup = 'domainData/USER/UNSET_USERGROUP',
    unsetProject = 'domainData/USER/UNSET_PROJECT',
}

// ACTION-CREATOR

export const setUserAction = (
    { userId, information, userGroups, projects }: SetUserAction,
) => ({
    userId,
    information,
    userGroups,
    projects,
    type: USER_PROFILE_ACTION.setUser,
});

export const unsetUserUserGroupAction = (
    { userId, userGroup }: UnsetUserUserGroupAction,
) => ({
    userId,
    userGroup,
    type: USER_PROFILE_ACTION.unsetUserGroup,
});

export const unsetUserProjectAction = (
    { userId, project }: UnsetUserProjectAction,
) => ({
    userId,
    project,
    type: USER_PROFILE_ACTION.unsetProject,
});

// REDUCER

const setUser = (state: DomainData, action: SetUserAction) => {
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

const usetUserUserGroup = (state: DomainData, action: UnsetUserUserGroupAction) => {
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

const usetUserProject = (state: DomainData, action: UnsetUserProjectAction) => {
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

const reducer: ReducerGroup<DomainData> = {
    [USER_PROFILE_ACTION.setUser]: setUser,
    [USER_PROFILE_ACTION.unsetUserGroup]: usetUserUserGroup,
    [USER_PROFILE_ACTION.unsetProject]: usetUserProject,
};

export default reducer;
