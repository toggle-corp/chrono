import React from 'react';
import { connect } from 'react-redux';

import Table from '../../../vendor/react-store/components/View/Table';

import {
    RootState,
    ProjectWiseSlotStat,
} from '../../../redux/interface';
import { projectWiseSlotStatsSelector }  from '../../../redux';
import { getHumanReadableTime } from '../../../utils/common';

import Filter from './Filter';
import headers from './headers';

import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    slotStats: ProjectWiseSlotStat[];
}
interface PropsFromDispatch {}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States{}

const keyExtractor = (slotStat: ProjectWiseSlotStat) => slotStat.id;

const getTotalTime = (data: ProjectWiseSlotStat[]) => (
    data.reduce(
        (acc, stat) => acc + stat.totalTimeInSeconds,
        0,
    )
);

export class Dashboard extends React.PureComponent<Props, States> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { slotStats } = this.props;

        return (
            <div>
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
    slotStats: projectWiseSlotStatsSelector(state),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps,
)(Dashboard);
