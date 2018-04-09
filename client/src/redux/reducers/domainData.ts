import update from '../../vendor/react-store/utils/immutable-update';
import createReducerWithMap from '../../utils/createReducerWithMap';

import {
    DomainData,
    ReducerGroup,
    SlotData,
    UserGroup,
    Project,
    Task,
    TimeslotView,

    Users,
    UnsetUserUserGroupAction,
    UnsetUserProjectAction,
    SetUserAction,
    SetProjectAction,
    SetUserGroupAction,
} from '../interface';
import initialDominDataState from '../initial-state/domainData';

const emptyArray: object[] = [];

// ACTION-TYPE

export const enum SLOT_DATA_ACTION {
    setSlot = 'domainData/SET_SLOT',
    setSlotView = 'domainData/SET_SLOT_VIEW',
}

export const enum USERGROUP_ACTION {
    setUserGroups = 'domainData/SET_USERGROUPS',
    setUserGroup = 'domainData/SET_USERGROUP',
}

export const enum PROJECTS_ACTION {
    setUserProjects = 'domainData/SET_USER_PROJECTS',
    setProject =  'domainData/SET_PROJECT',
}

export const enum TASKS_ACTION {
    setUserTasks = 'domainData/SET_USER_TASKS',
}

export const enum USER_PROFILE_ACTION {
    setUser = 'domainData/SET_USER',
    unsetUserGroup = 'domainData/USER_PROFILE/UNSET_USERGROUP',
    unsetProject = 'domainData/USER_PROFILE/UNSET_PROJECT',
}

// ACTION-CREATOR

export const setSlotAction = (data: SlotData) => ({
    data,
    type: SLOT_DATA_ACTION.setSlot,
});

export const setSlotViewAction = (params: TimeslotView) => ({
    params,
    type: SLOT_DATA_ACTION.setSlotView,
});

// PROJECTS
export const setProjectsAction = (projects: Project[]) => ({
    projects,
    type: PROJECTS_ACTION.setUserProjects,
});

export const setProjectAction = ({ userId, project }: SetProjectAction) => ({
    userId,
    project,
    type: PROJECTS_ACTION.setProject,
});

// USER-GROUP
export const setUserGroupsAction = (userGroups: UserGroup[]) => ({
    userGroups,
    type: USERGROUP_ACTION.setUserGroups,
});

export const setUserGroupAction = ({ userId, userGroup }: SetUserGroupAction) => ({
    userId,
    userGroup,
    type: USERGROUP_ACTION.setUserGroup,
});

// TASKS
export const setTasksAction = (tasks:  Task[]) => ({
    tasks,
    type: TASKS_ACTION.setUserTasks,
});

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

const getObjectChildren = (
    object: object, childrens: (string | number | undefined)[], defaultValue: any,
): any => {
    const child = childrens[0];
    if (!object || !child || object[child]) {
        return defaultValue;
    }
    if (childrens.length === 1) {
        return object[child];
    }
    return getObjectChildren(object[child], childrens.slice(1), defaultValue);
};

const findIndexOfUserGroupOfUser = (
    users: Users, userId: number | undefined, userGroupId: number,
) => {
    const userGroups: UserGroup[] = getObjectChildren(users, [userId, 'userGroups'], []);
    return userGroups.findIndex(userGroup => userGroup.id === userGroupId);
};

const findIndexOfProjectOfUser = (
    users: Users, userId: number | undefined, projectId: number,
) => {
    const projects: UserGroup[] = getObjectChildren(users, [userId, 'projects'], []);
    return projects.findIndex(project => project.id === projectId);
};
// REDUCER

// Slot
const setSlotData = (state: DomainData, action: { data: SlotData }) => {
    const { data } = action;
    const settings = {
        workspace: {
            timeslot: {
                [data.date]: { $auto: {
                    [data.id]: {
                        $set: data,
                    },
                } },
            },
        },
    };
    return update(state, settings);
};

const setSlotViewData = (state: DomainData, action: { params: TimeslotView }) => {
    const { params } = action;
    const settings = {
        timeslotViews: {
            [params.data.id]: {
                $set: params,
            },
        },
    };
    return update(state, settings);
};

// UserGroups
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

// Projects
const setProjects = (state: DomainData, action: { projects: Project[] }) => {
    const { projects } = action;
    const settings = {
        projects: {
            $auto: {
                $set: projects,
            },
        },
    };
    return update(state, settings);
};

const setProject = (state: DomainData, action: SetProjectAction) => {
    const { userId, project } = action;
    const { users, projects } = state;
    const projectIndex = projects.findIndex(p => p.id === project.id);

    const userProjectIndex = findIndexOfProjectOfUser(users, userId, project.id);

    const settings = {
        projects: { $autoArray: {
            $if: [
                projectIndex === -1,
                { $push: [project] },
                { [projectIndex]: { $set: project } },
            ],
        } },
        users: {
            // NOTE: $if will handle the userId undefined
            [userId || 0]: { $auto: {
                projects: { $autoArray: {
                    $if: [
                        userProjectIndex === -1,
                        { $push: [project] },
                        { [userProjectIndex]: { $set: project } },
                    ],
                } },
            } },
        },
    };
    return update(state, settings);
};

// Tasks
const setTasks = (state: DomainData, action: { tasks: Task[] }) => {
    const { tasks } = action;
    const settings = {
        tasks: {
            $auto: {
                $set: tasks,
            },
        },
    };
    return update(state, settings);
};

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

export const domainDataReducer: ReducerGroup<DomainData> = {
    [USERGROUP_ACTION.setUserGroups]: setUserGroups,
    [USERGROUP_ACTION.setUserGroup]: setUserGroup,

    [SLOT_DATA_ACTION.setSlot]: setSlotData,
    [SLOT_DATA_ACTION.setSlotView]: setSlotViewData,

    [PROJECTS_ACTION.setUserProjects]: setProjects,
    [PROJECTS_ACTION.setProject]: setProject,

    [TASKS_ACTION.setUserTasks]: setTasks,

    [USER_PROFILE_ACTION.setUser]: setUser,
    [USER_PROFILE_ACTION.unsetUserGroup]: usetUserUserGroup,
    [USER_PROFILE_ACTION.unsetProject]: usetUserProject,
};

export default createReducerWithMap(domainDataReducer, initialDominDataState);
