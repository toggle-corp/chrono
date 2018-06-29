import React from 'react';
import { connect } from 'react-redux';

import Table from '../../../vendor/react-store/components/View/Table';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';

import {
    RootState,
    OverviewSlotStat,
    DashboardLoadings,
} from '../../../redux/interface';
import {
    overviewSlotStatsSelector,
    dashboardLoadingSelector,
}  from '../../../redux';
import { getHumanReadableTime } from '../../../utils/common';

import Filter from './Filter';
import headers from './headers';

import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    slotStats: OverviewSlotStat[];
    loadings: DashboardLoadings;
}
interface PropsFromDispatch {}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States{}

const keyExtractor = (slotStat: OverviewSlotStat) => slotStat.id;

const getTotalTime = (data: OverviewSlotStat[]) => (
    data.reduce(
        (acc, stat) => acc + stat.totalTimeInSeconds,
        0,
    )
);

export class Overview extends React.PureComponent<Props, States> {

    render() {
        const {
            slotStats,
            loadings: {
                projectsLoading,
                tasksLoading,
                userGroupsLoading,
                usersLoading,
                overviewLoading,
            },
        } = this.props;

        const loading = (
            projectsLoading || tasksLoading || userGroupsLoading ||
            usersLoading || overviewLoading
        );

        return (
            <div>
                {loading && <LoadingAnimation message="Loading Data" />}
                <Filter />
                <Table
                    data={slotStats}
                    headers={headers}
                    keyExtractor={keyExtractor}
                />
                <div className={styles.summary}>
                    Total Time: {getHumanReadableTime(getTotalTime(slotStats))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    slotStats: overviewSlotStatsSelector(state),
    loadings: dashboardLoadingSelector(state),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps,
)(Overview);
