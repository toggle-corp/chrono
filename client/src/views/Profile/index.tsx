import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import {
    RootState,
    User,
    UserIdFromRoute,
    SetUserAction,
} from '../../redux/interface';

import { RestRequest } from '../../vendor/react-store/utils/rest';
import {
    userInformationSelector,
    userProjectsSelector,
    userUserGroupsSelector,
    userIdFromRoute,

    setUserAction,
} from '../../redux';

import UserProfileRequest from './requests/UserProfileRequest';
import UserGroupsRequest from './requests/UserGroupsRequest';

import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState extends User {
    userId: UserIdFromRoute;
}
interface PropsFromDispatch {
    setUser(params: SetUserAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States { }

export class Profile extends React.PureComponent<Props, States> {
    userProfileRequest: RestRequest;
    userGroupsRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            pending: true,
        };
    }

    componentWillMount() {
        const { userId } = this.props;
        this.startRequestsForUser(userId);
    }

    componentWillReceiveProps(nextProps: Props) {
        const { userId } = nextProps;
        if (this.props.userId !== userId) {
            this.startRequestsForUser(userId);
        }
    }

    componentWillUnmount() {
        if (this.userProfileRequest) {
            this.userProfileRequest.stop();
        }
        if (this.userGroupsRequest) {
            this.userGroupsRequest.stop();
        }
    }

    startRequestsForUser = (userId: UserIdFromRoute) => {
        this.startRequestForUserProfile(userId);
        this.startRequestForUserGroups(userId);
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

    startRequestForUserGroups = (userId: UserIdFromRoute) => {
        if (this.userGroupsRequest) {
            this.userGroupsRequest.stop();
        }
        const userGroupsRequest = new UserGroupsRequest({
            setUser: this.props.setUser,
            setState: states => this.setState(states),
        });
        this.userGroupsRequest = userGroupsRequest.create(userId);
        this.userGroupsRequest.start();
    }

    render() {
        const {
            information,
            userGroups,
            projects,
        } = this.props;

        console.warn(userGroups, projects);

        return (
            <div className={styles.profile}>
                <header className={styles.header}>
                    <h2>Profile</h2>
                </header>
                <div className={styles.info}>
                    <div className={styles.detail}>
                        <div className={styles.name}>
                            <div>
                                <span className={styles.first}>
                                    {information.firstName}
                                </span>
                                <span className={styles.last}>
                                    {information.lastName}
                                </span>
                            </div>
                        </div>
                        <p className={styles.email}>
                            {information.email}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    information: userInformationSelector(state),
    userGroups: userUserGroupsSelector(state),
    projects: userProjectsSelector(state),
    userId: userIdFromRoute(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setUser: (params: SetUserAction) => dispatch(setUserAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Profile);
