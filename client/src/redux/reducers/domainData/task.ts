import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,
    Task,
} from '../../interface';

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

const reducer: ReducerGroup<DomainData> = {
    [TASKS_ACTION.setUserTasks]: setTasks,
};

export default reducer;
