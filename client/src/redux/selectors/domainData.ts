import {
    RootState,
    Task,
    UserPartialInformation,
    UserGroup,
    Project,
} from '../interface';

const emptyObject = {};
const emptyArray: object[] = [];

export const tasksSelector = ({ domainData }: RootState): Task[] => (
    domainData.tasks || emptyObject
);

export const usersSelector = ({ domainData }: RootState): UserPartialInformation[] => (
    domainData.users || emptyObject
);

export const userGroupsSelector = ({ domainData }: RootState): UserGroup[] => (
    domainData.userGroups || emptyArray
);

export const projectsSelector = ({ domainData }: RootState): Project[] => (
    domainData.projects || emptyObject
);
