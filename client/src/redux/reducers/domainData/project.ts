import update from '#rsu/immutable-update';

import {
    DomainData,
    ReducerGroup,
    Project,
} from '../../interface';

// ACTION-TYPE

export const enum PROJECTS_ACTION {
    setProjects = 'domainData/PROJECT/SET_PROJECTS',
}

// ACTION-CREATOR

export const setProjectsAction = (projects: Project[]) => ({
    projects,
    type: PROJECTS_ACTION.setProjects,
});

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

const reducer: ReducerGroup<DomainData> = {
    [PROJECTS_ACTION.setProjects]: setProjects,
};

export default reducer;
