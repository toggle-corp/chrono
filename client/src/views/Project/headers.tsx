import React from 'react';
import { Link } from 'react-router-dom';

import {
    compareString,
    reverseRoute,
} from '../../vendor/react-store/utils/common';
import { Header } from '../../vendor/react-store/components/View/Table';
import FormattedDate from '../../vendor/react-store/components/View/FormattedDate';

import { Task } from '../../redux/interface';
import { pathNames } from '../../constants';

const headers: Header<Task>[] = [
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
];

export default headers;
