import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { RootState } from '../../redux/interface';
import {
    dashboardActiveViewSelector,
    setDashboardActiveViewAction,
}  from '../../redux';
import MultiViewContainer from '#rscv/MultiViewContainer';
import FixedTabs from '#rscv/FixedTabs';

import Overview from './Overview';
import ProjectWise from './ProjectWise';
import DayWise from './DayWise';

import RequestManager from './RequestManager';

import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    activeView: string;
}
interface PropsFromDispatch {
    setActiveView(view: string): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States{}

export class Dashboard extends React.PureComponent<Props, States> {

    static views = {
        overview: {
            component: Overview,
            wrapContainer: true,
        },
        projectWise: {
            component: ProjectWise,
            wrapContainer: true,
        },
        dayWise: {
            component: DayWise,
            wrapContainer: true,
        },
    };

    static tabs = {
        overview: 'Overview',
        projectWise: 'Project Wise',
        dayWise: 'Day Wise',
    };

    handleViewClick = (view: string) => {
        this.props.setActiveView(view);
    }

    render() {
        return (
            <div className={styles.dashboard}>
                <FixedTabs
                    className={styles.tabs}
                    tabs={Dashboard.tabs}
                    useHash
                    replaceHistory
                    defaultHash={this.props.activeView}
                    onClick={this.handleViewClick}
                />
                <MultiViewContainer
                    containerClassName={styles.container}
                    views={Dashboard.views}
                    useHash
                />
                <RequestManager />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    activeView: dashboardActiveViewSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setActiveView: (view: string) => dispatch(setDashboardActiveViewAction(view)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Dashboard);
