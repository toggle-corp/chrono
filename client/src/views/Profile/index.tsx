import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import {
    RootState,
    UserInformation,
    ActiveUser,
    SetUserAction,
} from '../../redux/interface';

import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import Modal from '../../vendor/react-store/components/View/Modal';
import ModalBody from '../../vendor/react-store/components/View/Modal/Body';
import ModalHeader from '../../vendor/react-store/components/View/Modal/Header';
import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton';
import { RestRequest } from '../../vendor/react-store/utils/rest';
import {
    userInformationSelector,
    userIdFromRouteSelector,
    activeUserSelector,

    setUserAction,
} from '../../redux';

import { iconNames } from '../../constants';

import ProfileEdit from './ProfileEdit';
import UserProjects from './UserProjects';
import UserUserGroups from './UserUserGroups';
import UserProjectAdd from './UserProjectAdd';
import UserUserGroupAdd from './UserUserGroupAdd';

import UserProfileGetRequest from './requests/UserProfileGetRequest';
import UserUserGroupsGetRequest from './requests/UserUserGroupsGetRequest';
import UserProjectsGetRequest from './requests/UserProjectsGetRequest';

import * as styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    userId?: number;
    information?: UserInformation;
    activeUser: ActiveUser;
}
interface PropsFromDispatch {
    setUser(params: SetUserAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    projectPending: boolean;
    userGroupPending: boolean;
    informationPending: boolean;
    showAddProjectModal: boolean;
    showAddUserGroupModal: boolean;
    showEditProfileModal: boolean;
}

export class Profile extends React.PureComponent<Props, States> {
    userProfileRequest: RestRequest;
    userGroupsRequest: RestRequest;
    projectsRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            projectPending: true,
            userGroupPending: true,
            informationPending: true,
            showAddProjectModal: false,
            showAddUserGroupModal: false,
            showEditProfileModal: false,
        };
    }

    componentWillMount() {
        const { userId } = this.props;
        if (userId) {
            this.startRequestsForUser(userId);
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        const { userId } = nextProps;
        if (this.props.userId !== userId && userId) {
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
        if (this.projectsRequest) {
            this.projectsRequest.stop();
        }
    }

    startRequestsForUser = (userId: number) => {
        this.startRequestForUserProfile(userId);
        this.startRequestForUserGroups(userId);
        this.startRequestForProjects(userId);
    }

    startRequestForUserProfile = (userId: number) => {
        if (this.userProfileRequest) {
            this.userProfileRequest.stop();
        }
        const userProfileRequest = new UserProfileGetRequest({
            setUser: this.props.setUser,
            setState: states => this.setState(states),
        });
        this.userProfileRequest = userProfileRequest.create(userId);
        this.userProfileRequest.start();
    }

    startRequestForUserGroups = (userId: number) => {
        if (this.userGroupsRequest) {
            this.userGroupsRequest.stop();
        }
        const userGroupsRequest = new UserUserGroupsGetRequest({
            setUser: this.props.setUser,
            setState: states => this.setState(states),
        });
        this.userGroupsRequest = userGroupsRequest.create(userId);
        this.userGroupsRequest.start();
    }

    startRequestForProjects = (userId: number) => {
        if (this.projectsRequest) {
            this.projectsRequest.stop();
        }
        const projectsRequest = new UserProjectsGetRequest({
            setUser: this.props.setUser,
            setState: states => this.setState(states),
        });
        this.projectsRequest = projectsRequest.create(userId);
        this.projectsRequest.start();
    }

    // Modal Open

    handleEditProfileClick = () => {
        this.setState({ showEditProfileModal: true });
    }

    handleAddProjectClick = () => {
        this.setState({ showAddProjectModal: true });
    }

    handleAddUserGroupClick = () => {
        this.setState({ showAddUserGroupModal: true });
    }

    // Modal Close

    handleEditProfileModalClose = () => {
        this.setState({ showEditProfileModal: false });
    }

    handleAddProjectModalClose = () => {
        this.setState({ showAddProjectModal: false });
    }

    handleAddUserGroupModalClose = () => {
        this.setState({ showAddUserGroupModal: false });
    }

    renderProfileEdit = () => {
        if (this.props.userId !== this.props.activeUser.userId) {
            return <div/>;
        }
        const { showEditProfileModal } = this.state;
        return (
            <div>
                <PrimaryButton
                    onClick={this.handleEditProfileClick}
                    transparent
                    iconName={iconNames.edit}
                    title="Edit Profile"
                />
                { showEditProfileModal &&
                    <Modal
                        closeOnEscape
                        onClose={this.handleEditProfileModalClose}
                    >
                        <ModalHeader
                            title="Edit Profile"
                            rightComponent={
                                <PrimaryButton
                                    onClick={this.handleEditProfileModalClose}
                                    transparent
                                >
                                    <span className={iconNames.close} />
                                </PrimaryButton>
                            }
                        />
                        <ModalBody>
                            <ProfileEdit
                                handleClose={this.handleEditProfileModalClose}
                            />
                        </ModalBody>
                    </Modal>
                }
            </div>
        );
    }

    renderUserUserGroup = () => {
        if (this.props.userId !== this.props.activeUser.userId) {
            return <div/>;
        }
        const { showAddUserGroupModal } = this.state;
        return (
            <div className={styles.usergroup}>
                 <div className={styles.header}>
                    <h2>
                        USER GROUPS
                    </h2>
                 <PrimaryButton
                    onClick={this.handleAddUserGroupClick}
                    iconName={iconNames.add}
                 >
                    Add User Group
                 </PrimaryButton>
                </div>
                <UserUserGroups />
                { showAddUserGroupModal &&
                    <Modal
                        closeOnEscape
                        onClose={this.handleAddUserGroupModalClose}
                    >
                        <ModalHeader
                            title="Add User Group"
                            rightComponent={
                                <PrimaryButton
                                    onClick={this.handleAddUserGroupModalClose}
                                    transparent
                                >
                                    <span className={iconNames.close} />
                                </PrimaryButton>
                            }
                        />
                        <ModalBody>
                            <UserUserGroupAdd
                                handleClose={this.handleAddUserGroupModalClose}
                            />
                        </ModalBody>
                    </Modal>
                }
            </div>
        );
    }

    renderUserProject = () => {
        if (this.props.userId !== this.props.activeUser.userId) {
            return <div/>;
        }
        const { showAddProjectModal } = this.state;
        return (
            <div className={styles.userproject}>
                 <div className={styles.header}>
                    <h2>
                        PROJECTS
                    </h2>
                    <PrimaryButton
                        onClick={this.handleAddProjectClick}
                        iconName={iconNames.add}
                    >
                    Add Project
                    </PrimaryButton>
                </div>
                <UserProjects />
                { showAddProjectModal &&
                    <Modal
                        closeOnEscape
                        onClose={this.handleAddProjectModalClose}
                    >
                        <ModalHeader
                            title="Add Project"
                            rightComponent={
                                <PrimaryButton
                                    onClick={this.handleAddProjectModalClose}
                                    transparent
                                >
                                    <span className={iconNames.close} />
                                </PrimaryButton>
                            }
                        />
                        <ModalBody>
                            <UserProjectAdd
                                handleClose={this.handleAddProjectModalClose}
                            />
                        </ModalBody>
                    </Modal>
                }
            </div>
        );
    }

    render() {
        const {
            // FIXME: move this to default props later
            information = {
                firstName: 'N/a',
                lastName: 'N/a',
                email: 'N/a',
            },
        } = this.props;

        const {
            projectPending,
            userGroupPending,
            informationPending,
        } = this.state;

        /* tslint:disable:variable-name */
        const ProfileEdit = this.renderProfileEdit;
        const UserUserGroup = this.renderUserUserGroup;
        const UserProject = this.renderUserProject;
        /* tslint:enable:variable-name */

        const pending = projectPending || userGroupPending || informationPending;

        return (
            <div className={styles.profile}>
                {pending && <LoadingAnimation />}
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
                            <ProfileEdit />
                        </div>
                        <p className={styles.email}>
                            {information.email}
                        </p>
                    </div>
                </div>
                <div className={styles.stats}>
                    <h2>Stats</h2>
                </div>

                <UserUserGroup />
                <UserProject />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    activeUser: activeUserSelector(state),
    information: userInformationSelector(state),
    userId: userIdFromRouteSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setUser: (params: SetUserAction) => dispatch(setUserAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Profile);
