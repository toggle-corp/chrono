import update from '../../vendor/react-store/utils/immutable-update';
import createReducerWithMap from '../../utils/createReducerWithMap';

import {
    DomainData,
    ReducerGroup,
    Task,

} from '../interface';
import initialDominDataState from '../initial-state/domainData';

// ACTION-TYPE

export const enum TASKS_ACTION {
    setUserTasks = 'domainData/SET_USER_TASKS',
}

// ACTION-CREATOR

// TASKS
export const setTasksAction = (tasks:  Task[]) => ({
    tasks,
    type: TASKS_ACTION.setUserTasks,
});

// HELPER

// REDUCER

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

export const taskReducer: ReducerGroup<DomainData> = {
    [TASKS_ACTION.setUserTasks]: setTasks,
};

export default createReducerWithMap(taskReducer, initialDominDataState);
