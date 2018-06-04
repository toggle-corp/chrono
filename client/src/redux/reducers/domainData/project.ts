import update from '../../../vendor/react-store/utils/immutable-update';
import { getObjectChildren } from '../../../vendor/react-store/utils/common';

import {
    DomainData,
    ReducerGroup,
    Project,
    Users,

    SetProjectAction,
} from '../../interface';

// ACTION-TYPE

export const enum PROJECTS_ACTION {
    setUserProjects = 'domainData/PROJECT/SET_USER_PROJECTS',
    setProject =  'domainData/PROJECT/SET_PROJECT',
}

// ACTION-CREATOR

export const setProjectsAction = (projects: Project[]) => ({
    projects,
    type: PROJECTS_ACTION.setUserProjects,
});

export const setProjectAction = ({ userId, project }: SetProjectAction) => ({
    userId,
    project,
    type: PROJECTS_ACTION.setProject,
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

const setProjects = (
    state: DomainData,
    action: { projects: Project[] },
) => {
    const { projects } = action;
    const settings = {
        projects: { $auto: {
            $set: projects,
        } },
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
            // FIXME: how? write documentation here
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

const reducer: ReducerGroup<DomainData> = {
    [PROJECTS_ACTION.setUserProjects]: setProjects,
    [PROJECTS_ACTION.setProject]: setProject,
};

export default reducer;
