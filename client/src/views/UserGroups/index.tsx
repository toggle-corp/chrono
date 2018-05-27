import React, {
    PureComponent,
} from 'react';

import { connect } from 'react-redux';
import {
    RootState,
    UserGroup,
} from '../../redux/interface';
import Modal from '../../vendor/react-store/components/View/Modal';
import ModalBody from '../../vendor/react-store/components/View/Modal/Body';
import ModalHeader from '../../vendor/react-store/components/View/Modal/Header';
import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';

import {
    userGroupSelector,
}  from '../../redux';

import { iconNames } from '../../constants';

import UserGroupProjects from './UserGroupProjects';
import UserGroupMembers from './UserGroupMembers';

import * as styles from './styles.scss';

interface OwnProps {} {}
interface PropsFromState {
    userGroup?: UserGroup;
}
interface PropsFromDispatch {
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States{
    showAddProjectModal: boolean;
    showAddMemberModal: boolean;
    memberPending: boolean;
    projectPending: boolean;
}
export class UserGroups extends PureComponent<Props, States> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showAddProjectModal: false,
            showAddMemberModal: false,
            memberPending: false,
            projectPending: false,
        };
    }

    handleAddProject = () => {
    }

    handleAddProjectModalClose = () => {
    }

    handleAddMember = () => {
    }

    handleAddMemberModalClose = () => {
    }

    renderUserGroupProjects = () => {
        const { showAddProjectModal } = this.state;
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
                          <div />
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
                        Add Group Member
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
                          <div />
                      </ModalBody>
                  </Modal>
                }
            </div>
        );
    }

    render() {
        const {
            userGroup,
        } = this.props;

        const {
            memberPending,
            projectPending,
        } = this.state;

        if (!userGroup) {
            return (
                <div>
                    This page doesnot exist!!;
                </div>
            );
        }

        // tslint:disable-next-line:variable-name
        const Projects = this.renderUserGroupProjects;
        // tslint:disable-next-line:variable-name
        const Members = this.renderUserGroupMembers;

        const pending = memberPending || projectPending;

        return (
            <div className={styles.usergroups}>
                {pending && <LoadingAnimation />}
                <header className={styles.header}>
                    <h2> UserGroup</h2>
                </header>
                <div className={styles.info}>
                    <div className={styles.detail}>
                        <span className={styles.name}>
                            {userGroup.title}
                        </span>
                        <div />
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
    userGroup: userGroupSelector(state),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps,
)(UserGroups);
