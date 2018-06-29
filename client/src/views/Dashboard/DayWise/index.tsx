import React from 'react';
import { connect } from 'react-redux';

import Table, { Header }  from '../../../vendor/react-store/components/View/Table';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';

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

export class Dashboard extends React.PureComponent<Props, States> {

    constructor(props: Props) {
        super(props);

        const {
            users,
            slotStats,
            filter,
        } = props;
        const { date } = filter;

        if (date) {
            this.state = {
                data: getData({
                    users,
                    start: date ? date.startDate : '2018-06-17',
                    end: date ? date.endDate : '2018-06-21',
                    data: slotStats,
                }),
                headers: getHeaders({ users }),
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
            this.setState({
                data: getData({
                    users,
                    start: date.startDate,
                    end: date.endDate,
                    data: slotStats,
                }),
                headers: getHeaders({ users }),
            });
        }
    }

    render() {
        const {
            slotStats,
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
                    Total Time: {getHumanReadableTime(getTotalTime(slotStats))}
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
