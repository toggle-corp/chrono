import { createSelector } from 'reselect';
import {
    RootState,
    Task,
    Tag,
    createPropsSelector,
    UserPartialInformation,
    UserGroup,
    Project,
} from '../interface';

const emptyObject = {};
const emptyArray: object[] = [];

const tagIdFromProps = createPropsSelector<number>('tagId');
const taskIdFromProps = createPropsSelector<number>('taskId');

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

export const tagsSelector = ({ domainData }: RootState): Tag[] => (
    domainData.tags || emptyObject
);

export const tagSelector = createSelector(
    tagsSelector,
    tagIdFromProps,
    (tags, tagId) => tags.find(tag => tag.id === tagId),
);

export const taskSelector = createSelector(
    tasksSelector,
    taskIdFromProps,
    (tasks, taskId) => tasks.find(task => task.id === taskId),
);
