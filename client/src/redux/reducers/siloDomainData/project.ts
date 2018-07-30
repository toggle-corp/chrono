import update from '../../../vendor/react-store/utils/immutable-update';
import { getObjectChildren } from '../../../vendor/react-store/utils/common';

import {
    SiloDomainData,
    ReducerGroup,
    Project,
    Users,
    SetProjectAction,
    SetProjectTasksAction,
    SetProjectTagsAction,
} from '../../interface';

// ACTION-TYPE

export const enum SILO_PROJECTS_ACTION {
    setProject =  'siloDomainData/PROJECT/SET_PROJECT',
    setProjectTasks =  'siloDomainData/PROJECT/SET_PROJECT_TASKS',
    setProjectTags =  'siloDomainData/PROJECT/SET_PROJECT_TAGS',
}

// ACTION-CREATOR

export const setProjectAction = ({ userId, project }: SetProjectAction) => ({
    userId,
    project,
    type: SILO_PROJECTS_ACTION.setProject,
});

export const setProjectTasksAction = ({ projectId, tasks }: SetProjectTasksAction) => ({
    projectId,
    tasks,
    type: SILO_PROJECTS_ACTION.setProjectTasks,
});

export const setProjectTagsAction = ({ projectId, tags }: SetProjectTagsAction) => ({
    projectId,
    tags,
    type: SILO_PROJECTS_ACTION.setProjectTags,
});

// HELPER

const findIndexOfProjectOfUser = (
    users: Users,
    userId: number | undefined,
    projectId: number,
) => {
    const projects: Project[] = getObjectChildren(users, [userId, 'projects']) || [];
    return projects.findIndex(project => project.id === projectId);
};
// REDUCER

const setProject = (state: SiloDomainData, action: SetProjectAction) => {
    const { userId, project } = action;
    const { users } = state;

    const userProjectIndex = findIndexOfProjectOfUser(users, userId, project.id);

    const settings = {
        projects: { $auto: {
            [project.id]: { $auto: {
                detail: {
                    $set: project,
                },
            } },
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

const setProjectTasks = (state: SiloDomainData, { tasks, projectId }: SetProjectTasksAction) => {
    const settings = {
        projects: { $auto: {
            [projectId]: { $auto: {
                tasks: {
                    $set: tasks,
                },
            } },
        } },
    };
    return update(state, settings);
};

const setProjectTags = (state: SiloDomainData, { tags, projectId }: SetProjectTagsAction) => {
    const settings = {
        projects: { $auto: {
            [projectId]: { $auto: {
                tags: {
                    $set: tags,
                },
            } },
        } },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<SiloDomainData> = {
    [SILO_PROJECTS_ACTION.setProject]: setProject,
    [SILO_PROJECTS_ACTION.setProjectTasks]: setProjectTasks,
    [SILO_PROJECTS_ACTION.setProjectTags]: setProjectTags,
};

export default reducer;
