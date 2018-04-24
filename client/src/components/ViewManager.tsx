import React, { Fragment }  from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Location } from 'history';
import { match as Match } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';

import Bundle from '../vendor/react-store/components/General/Bundle';

import { RootState } from '../redux/interface';
import { setRouteParamsAction } from '../redux';

interface OwnProps extends RouteComponentProps<{}> {
    load: () => any; // tslint:disable-line no-any
    name: string;
}
interface PropsFromState { }
interface PropsFromDispatch {
    setRouteParams({ match, location }: { match: Match<object>, location: Location }): void;
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

export class ViewManager extends React.PureComponent<Props, {}> {
    componentWillMount() {
        const { match, location } = this.props;
        this.props.setRouteParams({ match, location });
    }

    componentWillReceiveProps(nextProps: Props) {
        if (
            this.props.match !== nextProps.match ||
            this.props.location !== nextProps.location
        ) {
            this.props.setRouteParams({
                match: nextProps.match,
                location: nextProps.location,
            });
        }
    }

    render() {
        const { load, ...otherProps } = this.props;
        return (
            <Fragment>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>
                        {this.props.name}
                    </title>
                </Helmet>
                <Bundle
                    load={load}
                    {...otherProps}
                />
            </Fragment>
        );
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setRouteParams: (params: { match: Match<object>, location: Location }) => (
        dispatch(setRouteParamsAction(params))
    ),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    undefined, mapDispatchToProps,
)(ViewManager);
