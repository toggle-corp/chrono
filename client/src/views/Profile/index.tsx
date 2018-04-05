import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import {
    RootState,
    User,
    UserIdFromRoute,
} from '../../redux/interface';

import { RestRequest } from '../../vendor/react-store/utils/rest';
import {
    userSelector,
    userIdFromRoute,

    setUserAction,
} from '../../redux';

import UserProfileRequest from './requests/UserProfileRequest';

import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    user: User;
    userId: UserIdFromRoute;
}
interface PropsFromDispatch {
    setUser(params: User): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States { }

export class Profile extends React.PureComponent<Props, States> {
    userProfileRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            pending: true,
        };
    }

    componentWillMount() {
        const { userId } = this.props;
        this.startRequestForUserProfile(userId);
    }

    componentWillReceiveProps(nextProps: Props) {
        const { userId } = nextProps;
        if (this.props.userId !== userId) {
            this.startRequestForUserProfile(userId);
        }
    }

    componentWillUnmount() {
        if (this.userProfileRequest) {
            this.userProfileRequest.stop();
        }
    }

    startRequestForUserProfile = (userId: UserIdFromRoute) => {
        if (this.userProfileRequest) {
            this.userProfileRequest.stop();
        }
        const userProfileRequest = new UserProfileRequest({
            setUser: this.props.setUser,
            setState: states => this.setState(states),
        });
        this.userProfileRequest = userProfileRequest.create(userId);
        this.userProfileRequest.start();
    }

    render() {
        const { user } = this.props;

        return (
            <div className={styles.profile}>
                <header className={styles.header}>
                    <h2>Profile</h2>
                </header>
                <div className={styles.info}>
                    <div className={styles.name}>
                        <div>
                            <span className={styles.first}>
                                {user.firstName}
                            </span>
                            <span className={styles.last}>
                                {user.lastName}
                            </span>
                        </div>
                    </div>
                    <p className={styles.email}>
                        {user.email}
                    </p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    user: userSelector(state),
    userId: userIdFromRoute(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setUser: (params: User) => dispatch(setUserAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Profile);
