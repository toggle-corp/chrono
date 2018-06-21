import React from 'react';
import { Link } from 'react-router-dom';

import {
    compareString,
    reverseRoute,
} from '../../vendor/react-store/utils/common';
import { Header } from '../../vendor/react-store/components/View/Table';

import { SlotStat } from '../../redux/interface';

import { pathNames } from '../../constants';

const headers: Header<SlotStat>[] = [
    {
        key: 'userGroupDisplayName',
        label: 'User Group',
        order: 1,
        sortable: true,
        comparator: (a, b) => compareString(a.userGroupDisplayName, b.userGroupDisplayName),
        modifier: row => (
            <Link
                key={row.userGroup}
                to={reverseRoute(pathNames.userGroup, { userGroupId: row.userGroup })}
            >
                {row.userGroupDisplayName}
            </Link>
        ),
    },
    {
        key: 'projectDisplayName',
        label: 'Project',
        order: 2,
        sortable: true,
        comparator: (a, b) => compareString(a.projectDisplayName, b.projectDisplayName),
    },
    {
        key: 'userDisplayName',
        label: 'User',
        order: 3,
        sortable: true,
        comparator: (a, b) => compareString(a.userDisplayName, b.userDisplayName),
        modifier: row => (
            <Link
                key={row.user}
                to={reverseRoute(pathNames.profile, { userId: row.user })}
            >
                {row.userDisplayName}
            </Link>
        ),
    },
    {
        key: 'taskDisplayName',
        label: 'Task',
        order: 4,
        sortable: true,
        comparator: (a, b) => compareString(a.taskDisplayName, b.taskDisplayName),
    },
    {
        key: 'taskDescription',
        label: 'Description',
        order: 5,
        sortable: true,
        comparator: (a, b) => compareString(a.taskDescription, b.taskDescription),
    },
    {
        key: 'date',
        label: 'Date',
        order: 6,
        sortable: true,
        comparator: (a, b) => compareString(a.date, b.date),
    },
    {
        key: 'startTime',
        label: 'Start Time',
        order: 7,
        sortable: true,
        comparator: (a, b) => compareString(a.startTime, b.startTime),
    },
    {
        key: 'endTime',
        label: 'End Time',
        order: 8,
        sortable: true,
        comparator: (a, b) => compareString(a.endTime, b.endTime),
    },
    {
        key: 'remarks',
        label: 'Remarks',
        order: 9,
        sortable: true,
        comparator: (a, b) => compareString(a.remarks, b.remarks),
    },
];

export default headers;
