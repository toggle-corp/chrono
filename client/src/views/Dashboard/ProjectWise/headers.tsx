import React from 'react';
import { Link } from 'react-router-dom';

import {
    compareString,
    compareNumber,
    reverseRoute,
} from '../../../vendor/react-store/utils/common';
import { Header } from '../../../vendor/react-store/components/View/Table';
import Numeral from '../../../vendor/react-store/components/View/Numeral';

import { ProjectWiseSlotStat } from '../../../redux/interface';

import { pathNames } from '../../../constants';

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
        key: 'numberOfTask',
        label: 'Tasks',
        order: 2,
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
        order: 3,
        sortable: true,
        comparator: (a, b) => compareNumber(a.totalTimeInSeconds, b.totalTimeInSeconds),
    },
];

export default headers;
