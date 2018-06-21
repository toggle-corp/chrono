import update from '../../../vendor/react-store/utils/immutable-update';
import { getObjectChildren } from '../../../vendor/react-store/utils/common';

import {
    SiloDomainData,
    ReducerGroup,
    Project,
    Users,
    SetProjectAction,
} from '../../interface';

// ACTION-TYPE

export const enum SILO_PROJECTS_ACTION {
    setProject =  'siloDomainData/PROJECT/SET_PROJECT',
}

// ACTION-CREATOR

export const setProjectAction = ({ userId, project }: SetProjectAction) => ({
    userId,
    project,
    type: SILO_PROJECTS_ACTION.setProject,
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
            [project.id]: {
                $set: project,
            },
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

const reducer: ReducerGroup<SiloDomainData> = {
    [SILO_PROJECTS_ACTION.setProject]: setProject,
};

export default reducer;
