import React from 'react';
import { Link } from 'react-router-dom';

import {
    compareString,
    compareNumber,
    reverseRoute,
} from '#rsu/common';
import { Header } from '#rscv/Table';

import { OverviewSlotStat } from '../../../redux/interface';

import { pathNames } from '../../../constants';
import { getHumanReadableTime } from '../../../utils/common';

const headers: Header<OverviewSlotStat>[] = [
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
        key: 'userDisplayName',
        label: 'User',
        order: 2,
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
        key: 'projectDisplayName',
        label: 'Project',
        order: 3,
        sortable: true,
        comparator: (a, b) => compareString(a.projectDisplayName, b.projectDisplayName),
    },
    {
        key: 'taskDisplayName',
        label: 'Task',
        order: 4,
        sortable: true,
        comparator: (a, b) => compareString(a.taskDisplayName, b.taskDisplayName),
        modifier: row => (
            <span title={row.taskDescription}>{row.taskDisplayName}</span>
        ),
    },
    {
        key: 'tags',
        label: 'Tags',
        order: 5,
        sortable: true,
        comparator: (a, b) => compareString(a.taskDescription, b.taskDescription),
        modifier: row => (
            <span>{row.tags.map(tag => tag.title).join(', ')}</span>
        ),
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
        key: 'totalTime',
        label: 'Total Time',
        order: 9,
        sortable: true,
        comparator: (a, b) => compareNumber(a.totalTimeInSeconds, b.totalTimeInSeconds),
        modifier: row => getHumanReadableTime(row.totalTimeInSeconds),
    },
    {
        key: 'remarks',
        label: 'Remarks',
        order: 10,
        sortable: true,
        comparator: (a, b) => compareString(a.remarks, b.remarks),
    },
];

export default headers;
