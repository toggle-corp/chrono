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

    constructor(props: Props) {
        super(props);
    }

    handleViewClick = (view: string) => () => {
        this.props.setActiveView(view);
    }

    renderView = ({ activeView }: {activeView: string }) => {
        switch (activeView) {
            // case 'overview':
            default:
                return (
                    <Overview />
                );
        }
    }

    render() {
        const { activeView } = this.props;

        // tslint:disable-next-line variable-name
        const RenderView = this.renderView;

        return (
            <div>
                <PrimaryButton
                    onClick={this.handleViewClick('overview')}
                    disabled={activeView === 'overview'}
                >
                    Overview
                </PrimaryButton>
                <RenderView
                    activeView={activeView}
                />
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
