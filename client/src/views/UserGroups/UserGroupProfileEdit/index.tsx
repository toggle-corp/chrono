import React, {
    SFC, Fragment,
} from 'react';

import { UserGroup } from '../../../redux/interface';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import { iconNames } from '#rsk/index';
import UserGroupEditForm from './UserGroupEditForm';

interface OwnProps {
    onClick(): void;
    onClose(): void;
    userGroup: UserGroup;
    userGroupId?: number;
    showEditModal: boolean;
}

/* tslint:disable-next-line:variable-name */
const UserGroupProfileEdit: SFC<OwnProps> = props => (
    <Fragment>
        <PrimaryButton
            onClick={props.onClick}
            transparent
            iconName={iconNames.edit}
            title="Edit UserGroup"
        />
        {
            props.showEditModal &&
            <Modal
                closeOnEscape
                onClose={props.onClose}
            >
                <ModalHeader
                    title="Edit User Group"
                    rightComponent={
                        <PrimaryButton
                            onClick={props.onClose}
                            transparent
                            title="Close Modal"
                            iconName={iconNames.close}
                        />
                    }
                />
                <ModalBody>
                    <UserGroupEditForm
                        handleClose={props.onClose}
                        userGroup={props.userGroup}
                    />
                </ModalBody>
            </Modal>
        }
    </Fragment>
);

export default UserGroupProfileEdit;
