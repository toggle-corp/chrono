import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,
    Task,
} from '../../interface';

// ACTION-TYPE

export const enum TASKS_ACTION {
    setUserTasks = 'domainData/TASK/SET_USER_TASKS',
}

// ACTION-CREATOR

export const setTasksAction = (tasks:  Task[]) => ({
    tasks,
    type: TASKS_ACTION.setUserTasks,
});

// REDUCER

const setUserTasks = (state: DomainData, action: { tasks: Task[] }) => {
    const { tasks } = action;
    const settings = {
        tasks: {
            $auto: { $set: tasks },
        },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<DomainData> = {
    [TASKS_ACTION.setUserTasks]: setUserTasks,
};

export default reducer;
