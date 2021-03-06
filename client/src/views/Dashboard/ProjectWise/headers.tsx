import React from 'react';
import { Link } from 'react-router-dom';

import {
    compareString,
    compareNumber,
    reverseRoute,
} from '#rsu/common';
import { Header } from '#rscv/Table';
import Numeral from '#rscv/Numeral';

import { ProjectWiseSlotStat } from '../../../redux/interface';

import { pathNames } from '../../../constants';
import { getHumanReadableTime } from '../../../utils/common';

const headers: Header<ProjectWiseSlotStat>[] = [
    {
        key: 'userDisplayName',
        label: 'User',
        order: 1,
        sortable: true,
        comparator: (a, b) => compareString(a.userDisplayName, b.userDisplayName),
        modifier: row => (
            <Link
                key={row.id}
                to={reverseRoute(pathNames.profile, { userId: row.id })}
            >
                {row.userDisplayName}
            </Link>
        ),
    },
    {
        key: 'projectTitle',
        label: 'Project',
        order: 2,
        sortable: true,
        comparator: (a, b) => compareString(a.projectTitle, b.projectTitle),
        modifier: row => (
            <Link
                key={row.project}
                to={reverseRoute(pathNames.project, { projectId: row.project })}
            >
                {row.projectTitle}
            </Link>
        ),
    },
    {
        key: 'numberOfTask',
        label: 'Tasks',
        order: 3,
        sortable: true,
        comparator: (a, b) => compareNumber(a.totalTasks, b.totalTasks),
        modifier: row => (
            <Numeral
                precision={0}
                value={row.totalTasks}
            />
        ),
    },
    {
        key: 'totalTime',
        label: 'Total Time',
        order: 4,
        sortable: true,
        comparator: (a, b) => compareNumber(a.totalTimeInSeconds, b.totalTimeInSeconds),
        modifier: row => getHumanReadableTime(row.totalTimeInSeconds),
    },
];

export default headers;
