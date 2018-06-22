import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton';

import { RootState } from '../../redux/interface';
import {
    dashboardActiveViewSelector,
    setDashboardActiveViewAction,
}  from '../../redux';

import Overview from './Overview';
import ProjectWise from './ProjectWise';
import DayWise from './DayWise';

import RequestManager from './RequestManager';

// import * as styles from './styles.scss';

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
        overview: 'overview',
        projectWise: 'projectWise',
        dayWise: 'dayWise',
    };

    // FIXME: non useful constructor
    constructor(props: Props) {
        super(props);
    }

    handleViewClick = (view: string) => () => {
        this.props.setActiveView(view);
    }

    renderTabs = () => {
        // TODO: Add Tabs
        const { activeView } = this.props;
        return (
            <div>
                <PrimaryButton
                    onClick={this.handleViewClick(Dashboard.views.overview)}
                    disabled={activeView === Dashboard.views.overview}
                >
                    Overview
                </PrimaryButton>
                <PrimaryButton
                    onClick={this.handleViewClick(Dashboard.views.projectWise)}
                    disabled={activeView === Dashboard.views.projectWise}
                >
                    Project Wise
                </PrimaryButton>
                <PrimaryButton
                    onClick={this.handleViewClick(Dashboard.views.dayWise)}
                    disabled={activeView === Dashboard.views.dayWise}
                >
                    Day Wise
                </PrimaryButton>
            </div>
        );
    }

    renderView = () => {
        const { activeView } = this.props;
        switch (activeView) {
            case Dashboard.views.dayWise:
                return (
                    <DayWise />
                );
            case Dashboard.views.projectWise:
                return (
                    <ProjectWise />
                );
            default:
                return (
                    <Overview />
                );
        }
    }

    render() {
        // tslint:disable-next-line variable-name
        const RenderView = this.renderView;
        // tslint:disable-next-line variable-name
        const RenderTabs = this.renderTabs;

        return (
            <div>
                <RenderTabs />
                <RenderView />
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
