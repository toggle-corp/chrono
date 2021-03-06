import React from 'react';
import { Link } from 'react-router-dom';

import {
    compareString,
    reverseRoute,
} from '#rsu/common';
import { Header } from '#rscv/Table';
import FormattedDate from '#rscv/FormattedDate';

import { Task } from '../../redux/interface';
import { pathNames } from '../../constants';

import AddTag from '../../components/AddTag';
import AddTask from '../../components/AddTask';

export const taskHeaders: Header<Task>[] = [
    { key: 'title',
        label: 'Title',
        order: 1,
        sortable: true,
        comparator: (a, b) => compareString(a.title, b.title),
    },
    {
        key: 'createdByName',
        label: 'Created By',
        order: 2,
        sortable: true,
        comparator: (a, b) => compareString(a.createdByName, b.createdByName),
        modifier: row => (
            <Link
                key={row.createdBy}
                to={reverseRoute(pathNames.profile, { userId: row.createdBy })}
            >
                {row.createdByName}
            </Link>
        ),
    },
    {
        key: 'createdAt',
        label: 'Created At',
        order: 3,
        sortable: true,
        comparator: (a, b) => compareString(a.createdAt, b.createdAt),
        modifier: row => (
            <FormattedDate
                value={row.createdAt}
                mode="dd-MMM-yy"
            />
        ),
    },
    {
        key: 'description',
        label: 'Description',
        order: 4,
        sortable: true,
        comparator: (a, b) => compareString(a.description, b.description),
    },
    {
        key: 'action',
        label: 'Action',
        order: 5,
        modifier: row => (
            <AddTask
                userGroupId={row.userGroup}
                projectId={row.project}
                taskId={row.id}
                disabledProjectChange
            />
        ),
    },
];

export const tagHeaders: Header<Task>[] = [
    { key: 'title',
        label: 'Title',
        order: 1,
        sortable: true,
        comparator: (a, b) => compareString(a.title, b.title),
    },
    {
        key: 'createdByName',
        label: 'Created By',
        order: 2,
        sortable: true,
        comparator: (a, b) => compareString(a.createdByName, b.createdByName),
        modifier: row => (
            <Link
                key={row.createdBy}
                to={reverseRoute(pathNames.profile, { userId: row.createdBy })}
            >
                {row.createdByName}
            </Link>
        ),
    },
    {
        key: 'createdAt',
        label: 'Created At',
        order: 3,
        sortable: true,
        comparator: (a, b) => compareString(a.createdAt, b.createdAt),
        modifier: row => (
            <FormattedDate
                value={row.createdAt}
                mode="dd-MMM-yy"
            />
        ),
    },
    {
        key: 'description',
        label: 'Description',
        order: 4,
        sortable: true,
        comparator: (a, b) => compareString(a.description, b.description),
    },
    {
        key: 'action',
        label: 'Action',
        order: 5,
        modifier: row => (
            <AddTag
                tagId={row.id}
                disabledProjectChange
            />
        ),
    },
];
