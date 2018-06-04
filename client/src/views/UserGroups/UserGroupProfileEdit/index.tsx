import React, {
    SFC,
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
    <div>
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
                    title="Edit UserGroup"
                    rightComponent={
                        <PrimaryButton
                            onClick={props.onClose}
                            transparent
                        >
                            <span  className={iconNames.close} />
                        </PrimaryButton>
                    }
                />
                <ModalBody>
                    <UserGroupEditForm
                        handleClose={props.onClose}
                    />
                </ModalBody>
            </Modal>
        }
    </div>
);

export default UserGroupProfileEdit;
