import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { RootState } from '../../redux/interface';
import {
    dashboardActiveViewSelector,
    setDashboardActiveViewAction,
}  from '../../redux';
import MultiViewContainer from '../../vendor/react-store/components/View/MultiViewContainer';
import FixedTabs from '../../vendor/react-store/components/View/FixedTabs';

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
        },
        projectWise: {
            component: ProjectWise,
        },
        dayWise: {
            component: DayWise,
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
                    tabs={Dashboard.tabs}
                    useHash
                    replaceHistory
                    defaultHash={this.props.activeView}
                    onClick={this.handleViewClick}
                />
                <div
                    className={styles.content}
                >
                    <MultiViewContainer
                        views={Dashboard.views}
                        useHash
                    />
                </div>
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
