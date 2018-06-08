import React, {
    SFC, Fragment,
} from 'react';

import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import Modal from '../../../vendor/react-store/components/View/Modal';
import ModalBody from '../../../vendor/react-store/components/View/Modal/Body';
import ModalHeader from '../../../vendor/react-store/components/View/Modal/Header';
import { iconNames } from '../../../vendor/react-store/constants';
import UserGroupEditForm from './UserGroupEditForm';

interface OwnProps {
    onClick(): void;
    onClose(): void;
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
                    />
                </ModalBody>
            </Modal>
        }
    </Fragment>
);

export default UserGroupProfileEdit;
