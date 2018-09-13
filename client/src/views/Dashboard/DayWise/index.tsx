import React from 'react';
import { connect } from 'react-redux';

import Table, { Header }  from '#rscv/Table';
import LoadingAnimation from '#rscv/LoadingAnimation';
import { isTruthy } from '#rsu/common';

import {
    RootState,
    DayWiseSlotStat,
    DayWiseParams,
    UserPartialInformation,
    DashboardLoadings,
} from '../../../redux/interface';
import {
    dayWiseSlotStatsSelector,
    dayWiseFilterSelector,
    usersSelector,
    dashboardLoadingSelector,
}  from '../../../redux';
import { getHumanReadableTime } from '../../../utils/common';

import Filter from './Filter';
import {
    getHeaders,
    getData,
} from './headers';

import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    slotStats: DayWiseSlotStat[];
    users: UserPartialInformation[];
    filter: DayWiseParams;
    loadings: DashboardLoadings;
}
interface PropsFromDispatch {}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

export interface FormatedData {
    date: Date;
    [key: number]: number;
}

interface States{
    data?: FormatedData[];
    headers?: Header<FormatedData>[];
    users?: UserPartialInformation[];
    totalTime?: number;
    totalTimePerUser?: {
        [key: number] : number;
    };
}

const keyExtractor = (slotStat: FormatedData) => slotStat.date.toISOString();

const getTotalTime = (data: DayWiseSlotStat[]) => (
    data.reduce(
        (acc, stat) => {
            let newAcc = acc;
            stat.users.forEach((user) => {
                newAcc += user.totalTimeInSeconds;
            });
            return newAcc;
        },
        0,
    )
);

const getTotalTimePerUser = (data: DayWiseSlotStat[]) => (
    data.reduce(
        (acc, stat) => {
            stat.users.forEach((user) => {
                if (isTruthy(user.totalTimeInSeconds)) {
                    if (acc[user.id]) {
                        acc[user.id] += user.totalTimeInSeconds;
                    } else {
                        acc[user.id] = user.totalTimeInSeconds;
                    }
                }
            });
            return acc;
        },
        {},
    )
);

const getFilteredUser = (usersId: number[] = [], users: UserPartialInformation[]) => {
    if (usersId.length) {
        const filteredUsers = users.filter(
            user => usersId.findIndex(id => id === user.id) !== -1,
        );
        return filteredUsers;
    }
    return users;
};

export class Dashboard extends React.PureComponent<Props, States> {

    constructor(props: Props) {
        super(props);

        const {
            users,
            slotStats,
            filter,
        } = props;
        const { date } = filter;
        const fUsers = getFilteredUser(filter.users, users);

        if (date) {
            this.state = {
                data: getData({
                    users,
                    start: date ? date.startDate : '2018-06-17',
                    end: date ? date.endDate : '2018-06-21',
                    data: slotStats,
                }),
                headers: getHeaders({ users: fUsers }),
                users: fUsers,
                totalTime: getTotalTime(props.slotStats),
                totalTimePerUser: getTotalTimePerUser(props.slotStats),
            };
        } else {
            this.state = {};
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        const {
            users,
            slotStats,
            filter,
        } = nextProps;
        const { date } = filter;
        if (this.props.slotStats !== slotStats && filter.date) {
            const fUsers = getFilteredUser(filter.users, users);
            this.setState({
                data: getData({
                    users,
                    start: date.startDate,
                    end: date.endDate,
                    data: slotStats,
                }),
                users: fUsers,
                headers: getHeaders({ users: fUsers }),
                totalTime: getTotalTime(nextProps.slotStats),
                totalTimePerUser: getTotalTimePerUser(nextProps.slotStats),
            });
        }
    }

    render() {
        const {
            loadings: {
                projectsLoading,
                tasksLoading,
                userGroupsLoading,
                usersLoading,
                dayWiseLoading,
            },
        } = this.props;

        const {
            headers,
            data,
            totalTime,
            users,
            totalTimePerUser,
        } = this.state;

        const loading = (
            projectsLoading || tasksLoading || userGroupsLoading ||
            usersLoading || dayWiseLoading
        );

        return (
            <div>
                {loading && <LoadingAnimation message="Loading Data" />}
                <Filter />
                {
                    (data && headers) ?
                        <Table
                            data={data}
                            headers={headers}
                            keyExtractor={keyExtractor}
                        />
                        : 'Select Date'
                }
                <div className={styles.summary}>
                    // TODO: Use ListView
                    Total Time: {getHumanReadableTime(totalTime)}
                    {
                        (users && totalTimePerUser) ?
                        users.map(user => (
                            <div key={user.id}>
                                <span>{user.displayName}</span>
                                <span>{
                                    getHumanReadableTime(
                                        totalTimePerUser[user.id],
                                    )}
                                </span>
                                <br/>
                            </div>
                        )) : <div />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    slotStats: dayWiseSlotStatsSelector(state),
    filter: dayWiseFilterSelector(state),
    users: usersSelector(state),
    loadings: dashboardLoadingSelector(state),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps,
)(Dashboard);
