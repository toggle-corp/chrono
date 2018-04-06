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
} from '../interface';
import initialDominDataState from '../initial-state/domainData';

// ACTION-TYPE

export const enum SLOT_DATA_ACTION {
    setSlot = 'domainData/SET_SLOT',
    setSlotView = 'domainData/SET_SLOT_VIEW',
}

export const enum USERGROUP_ACTION {
    setUserGroups = 'domainData/SET_USERGROUPS',
}

export const enum PROJECTS_ACTION {
    setUserProjects = 'domainData/SET_USER_PROJECTS',
}

export const enum TASKS_ACTION {
    setUserTasks = 'domainData/SET_USER_TASKS',
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

// USER-GROUP
export const setUserGroupsAction = (userGroups: UserGroup[]) => ({
    userGroups,
    type: USERGROUP_ACTION.setUserGroups,
});

// TASKS    
export const setTasksAction = (tasks:  Task[]) => ({
    tasks,
    type: TASKS_ACTION.setUserTasks,
});

// HELPER

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

export const domainDataReducer: ReducerGroup<DomainData> = {
    [USERGROUP_ACTION.setUserGroups]: setUserGroups,
    [SLOT_DATA_ACTION.setSlot]: setSlotData,
    [SLOT_DATA_ACTION.setSlotView]: setSlotViewData,
    [PROJECTS_ACTION.setUserProjects]: setProjects,
    [TASKS_ACTION.setUserTasks]: setTasks,
};

export default createReducerWithMap(domainDataReducer, initialDominDataState);
