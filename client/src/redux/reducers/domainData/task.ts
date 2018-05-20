import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,
    Task,
} from '../../interface';

// ACTION-TYPE

export const enum TASKS_ACTION {
    setUserTasks = 'domainData/TASK/SET_USER_TASKS',
    setTask = 'domainData/TASK/SET_TASK',
}


// ACTION-CREATOR

export const setTasksAction = (tasks:  Task[]) => ({
    tasks,
    type: TASKS_ACTION.setUserTasks,
});

export const setTaskAction = (task: Task) => ({
    task,
    type: TASKS_ACTION.setTask,
});

// REDUCER

const setUserTasks = (state: DomainData, action: { tasks: Task[] }) => {
    const { tasks } = action;
    const settings = {
        tasks: { $autoArray: {
            $set: tasks,
        } },
    };
    return update(state, settings);
};

const setTask = (state: DomainData, action: { task: Task }) => {
    const { task } = action;
    const { tasks } = state;
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    const settings = {
        tasks: { $autoArray: {
            $if: [
                taskIndex === -1,
                { $push: [task] },
                { $splice: [[taskIndex, 1, task]] },
            ],
        } },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<DomainData> = {
    [TASKS_ACTION.setUserTasks]: setUserTasks,
    [TASKS_ACTION.setTask]: setTask,
};

export default reducer;
