import React, {
    PureComponent,
} from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import Message from '../../vendor/react-store/components/View/Message';
import Modal from '../../vendor/react-store/components/View/Modal';
import ModalBody from '../../vendor/react-store/components/View/Modal/Body';
import ModalHeader from '../../vendor/react-store/components/View/Modal/Header';

import {
    RootState,
    UserGroup,
    SetUserGroupAction,
    SetUserGroupProjectsAction,
} from '../../redux/interface';

import {
    setUserGroupAction,
    isUserAdminSelector,
    setUserGroupProjectsAction,
    userGroupIdFromRouteSelector,
    userGroupSelector,
}  from '../../redux';

import { iconNames } from '../../constants';

import { RestRequest } from '../../vendor/react-store/utils/rest';

import UserGroupGetRequest from './requests/UserGroupGetRequest';
import ProjectsGetRequest from './requests/ProjectsGetRequest';

import AddProject from '../../components/AddProject';
import MemberAdd from './MemberAdd';
import UserGroupMembers from './UserGroupMembers';
import UserGroupProfileEdit from './UserGroupProfileEdit';
import UserGroupProjects from './UserGroupProjects';

import * as styles from './styles.scss';

interface OwnProps {} {}
interface PropsFromState {
    userGroupId?: number;
    isAdmin: boolean;
    userGroup?: UserGroup;
}
interface PropsFromDispatch {
    setUserGroup(params: SetUserGroupAction): void;
    setUserGroupProjects(params: SetUserGroupProjectsAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States{
    projectsPending: boolean;
    showAddMemberModal: boolean;
    showAddProjectModal: boolean;
    userGroupInfoPending: boolean;
    showEditUserGroupModal: boolean;
}
export class UserGroups extends PureComponent<Props, States> {
    userGroupProjectsRequest: RestRequest;
    userGroupRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            projectsPending: false,
            userGroupInfoPending: false,
            showAddMemberModal: false,
            showAddProjectModal: false,
            showEditUserGroupModal: false,
        };
    }

    componentWillMount() {
        const { userGroupId } = this.props;
        if (userGroupId) {
            this.startRequestForUserGroup(userGroupId);
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        const { userGroupId } = nextProps;
        if (this.props.userGroupId !== userGroupId && userGroupId) {
            this.startRequestForUserGroup(userGroupId);
        }
    }

    componentWillUnmount() {
        if (this.userGroupRequest) {
            this.userGroupRequest.stop();
        }
        if (this.userGroupProjectsRequest) {
            this.userGroupProjectsRequest.stop();
        }
    }

    startRequestForUserGroup = (userGroupId: number) => {
        this.requestForUserGroupInfo(userGroupId);
        this.requestForUserGroupProjects(userGroupId);
    }

    requestForUserGroupInfo = (userGroupId: number) => {
        if (this.userGroupRequest) {
            this.userGroupRequest.stop();
        }

        const userGroupRequest = new UserGroupGetRequest({
            setUserGroup: this.props.setUserGroup,
            setState: states => this.setState(states),
        });
        this.userGroupRequest = userGroupRequest.create(userGroupId);
        this.userGroupRequest.start();
    }

    requestForUserGroupProjects = (userGroupId: number) => {
        if (this.userGroupProjectsRequest) {
            this.userGroupProjectsRequest.stop();
        }

        const projectsRequest = new ProjectsGetRequest({
            setUserGroupProjects: this.props.setUserGroupProjects,
            setState: states => this.setState(states),
        });
        this.userGroupProjectsRequest = projectsRequest.create(userGroupId);
        this.userGroupProjectsRequest.start();
    }

    handleEditUserGroupClick = () => {
        this.setState({ showEditUserGroupModal: true });
    }

    handleEditUserGroupClose = () => {
        this.setState({ showEditUserGroupModal: false });
    }

    handleAddProject = () => {
        this.setState({ showAddProjectModal: true });
    }

    handleAddProjectModalClose = () => {
        this.setState({ showAddProjectModal: false });
    }

    handleAddMember = () => {
        this.setState({ showAddMemberModal: true });
    }

    handleAddMemberModalClose = () => {
        this.setState({ showAddMemberModal: false });
    }

    renderUserGroupProjects = () => {
        const { showAddProjectModal } = this.state;
        const { userGroup } = this.props;
        return (
            <div className={styles.userprojects}>
                <div className={styles.header}>
                    <h2>
                        Projects
                    </h2>
                    <PrimaryButton
                        onClick={this.handleAddProject}
                        iconName={iconNames.add}
                    >
                        Add Project
                    </PrimaryButton>
                </div>
                <UserGroupProjects />
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
                          <AddProject
                              handleClose={this.handleAddProjectModalClose}
                              userGroupId={userGroup ? userGroup.id :  undefined}
                          />
                      </ModalBody>
                  </Modal>
                }
            </div>
        );
    }

    renderUserGroupMembers = () => {
        const { showAddMemberModal } = this.state;

        return (
            <div className={styles.usermembers}>
                <div className={styles.header}>
                    <h2>
                        Members
                    </h2>
                    <PrimaryButton
                        onClick={this.handleAddMember}
                        iconName={iconNames.add}
                    >
                        Add User Member
                    </PrimaryButton>
                </div>
                <UserGroupMembers />
                { showAddMemberModal &&
                  <Modal
                      closeOnEscape
                      onClose={this.handleAddMemberModalClose}
                  >
                      <ModalHeader
                          title="Add Member"
                          rightComponent={
                              <PrimaryButton
                                  onClick={this.handleAddMemberModalClose}
                                  transparent
                              >
                                  <span className={iconNames.close} />
                              </PrimaryButton>
                          }
                      />
                      <ModalBody>
                          <MemberAdd
                              userGroupId={this.props.userGroupId}
                              handleClose={this.handleAddMemberModalClose}
                          />
                      </ModalBody>
                  </Modal>
                }
            </div>
        );
    }

    render() {
        const {
            userGroup,
            isAdmin,
        } = this.props;

        const {
            projectsPending,
            showEditUserGroupModal,
            userGroupInfoPending,
        } = this.state;

        if (!userGroup) {
            return (
                <Message>
                    The usergroup doesn't exist.
                </Message>
            );
        }

        // tslint:disable-next-line:variable-name
        const Projects = this.renderUserGroupProjects;
        // tslint:disable-next-line:variable-name
        const Members = this.renderUserGroupMembers;

        const pending = userGroupInfoPending || projectsPending;

        return (
            <div className={styles.usergroups}>
                {pending && <LoadingAnimation />}
                <header className={styles.header}>
                    <h2>UserGroup</h2>
                </header>
                <div className={styles.info}>
                    <div className={styles.detail}>
                        <span className={styles.title}>
                            {userGroup.title}
                        </span>
                        <span className={styles.description}>
                            {userGroup.description}
                        </span>
                        {
                            isAdmin &&
                            <UserGroupProfileEdit
                                onClick={this.handleEditUserGroupClick}
                                onClose={this.handleEditUserGroupClose}
                                showEditModal={showEditUserGroupModal}
                            />
                        }
                    </div>
                </div>
                <div className={styles.log}>
                    <h2>Activity</h2>
                </div>
                <Projects />
                <Members />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    userGroupId: userGroupIdFromRouteSelector(state),
    isAdmin: isUserAdminSelector(state),
    userGroup: userGroupSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setUserGroup: (params: SetUserGroupAction) =>
        dispatch(setUserGroupAction(params)),
    setUserGroupProjects: (params: SetUserGroupProjectsAction) =>
        dispatch(setUserGroupProjectsAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(UserGroups);
