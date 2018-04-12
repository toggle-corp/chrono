import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,

    UnsetUserUserGroupAction,
    UnsetUserProjectAction,
    SetUserAction,
} from '../../interface';

const emptyArray: object[] = [];

// ACTION-TYPE

export const enum USER_PROFILE_ACTION {
    setUser = 'domainData/SET_USER',
    unsetUserGroup = 'domainData/USER_PROFILE/UNSET_USERGROUP',
    unsetProject = 'domainData/USER_PROFILE/UNSET_PROJECT',
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

// HELPER

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
    const { userGroups } = state.users[userId] || emptyArray;
    const userGroupIndex = userGroups.findIndex(userG => userG.id === userGroup.id);

    const settings = {
        users: {
            [userId]: { $auto: {
                userGroups: {
                    $if: [
                        userGroupIndex !== -1,
                        { $splice: [[userGroupIndex, 1]] },
                    ],
                },
            } },
        },
    };
    return update(state, settings);
};

const usetUserProject = (state: DomainData, action: UnsetUserProjectAction) => {
    const { userId, project } = action;
    const { projects } = state.users[userId] || emptyArray;
    const projectIndex = projects.findIndex(p => p.id === project.id);

    const settings = {
        users: {
            [userId]: { $auto: {
                projects: {
                    $if: [
                        projectIndex !== -1,
                        { $splice: [[projectIndex, 1]] },
                    ],
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
