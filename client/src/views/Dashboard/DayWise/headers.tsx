import React from 'react';
import {
    compareNumber,
    compareString,
} from '../../../vendor/react-store/utils/common';
import { Header } from '../../../vendor/react-store/components/View/Table';
import FormattedDate from '../../../vendor/react-store/components/View/FormattedDate';

import {
    DayWiseSlotStat,
    UserPartialInformation,
} from '../../../redux/interface';

import { getHumanReadableTime } from '../../../utils/common';
import { FormatedData } from '../DayWise';

interface DataParams {
    start: string;
    end: string;
    data: DayWiseSlotStat[];
    users: UserPartialInformation[];
}

interface HeaderParams {
    users: UserPartialInformation[];
}

const getDateArray = (start: Date, end: Date) => {
    const arr = [];
    const dt = new Date(start);

    while (dt <= end) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
};

export const getData = ({ start, end, users, data }: DataParams) => {
    const dateArray = getDateArray(new Date(start), new Date(end));
    const newData = dateArray.map(date => ({
        date,
        ...users.reduce(
            (acc, user) => {
                const dateDatum = data.find(
                    datum => (
                        date.getTime() === new Date(datum.date).getTime()
                    ),
                );
                const userDatum = dateDatum ? dateDatum.users.find(
                    datum => (datum.id === user.id),
                ) : undefined;
                acc[user.id] = userDatum ? userDatum.totalTimeInSeconds : 0;
                return acc;
            },
            {}),
    }));
    return newData;
};

export const getHeaders = ({ users } : HeaderParams) => {
    const headers: Header<FormatedData>[] = users.map(user => ({
        key: String(user.id),
        label: user.displayName,
        order: user.id,
        sortable: true,
        comparator: (a: FormatedData, b: FormatedData) => compareNumber(a[user.id], b[user.id]),
        modifier: (row: FormatedData) => (
            <span>{getHumanReadableTime(row[user.id])}</span>
        ),
    }));
    return [
        {
            key: 'date',
            label: 'Date',
            order: 0,
            sortable: true,
            comparator: (a: FormatedData, b: FormatedData) => compareString(
                a.date.toISOString(),
                b.date.toISOString(),
            ),
            modifier: (row: FormatedData) => (
                <FormattedDate
                    value={row.date.toISOString()}
                    mode="MMM dd, yyyy"
                />
            ),
        },
        ...headers,
    ];
};
