import React, {
    Fragment,
} from 'react';

import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton';

import { iconNames } from '../../constants';

import AddTaskModal from './AddTaskModal';

interface Props {
    disabled?: boolean;
    disabledProjectChange?: boolean;
    userGroupId?: number;
    projectId?: number;
    onTaskCreate?(taskId: number): void;
    taskId?: number;
}

interface States {
    showModal: boolean;
}

export default class AddTask extends React.PureComponent<Props, States> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showModal: false,
        };
    }

    handleAddTaskButton = () => {
        this.setState({ showModal: true });
    }

    handleAddTaskModalClose = () => {
        this.setState({ showModal: false });
    }

    render() {
        const { showModal } = this.state;
        const {
            disabled,
            onTaskCreate,
            disabledProjectChange,
            projectId,
            userGroupId,
            taskId,
        } = this.props;

        return(
            <Fragment>
                <PrimaryButton
                    onClick={this.handleAddTaskButton}
                    transparent
                    title={!taskId ? 'Create task for a project' : 'Edit task for a project'}
                    disabled={showModal || disabled}
                    iconName={!taskId ? iconNames.add : iconNames.edit}
                />
                {
                    showModal &&
                    <AddTaskModal
                        projectId={projectId}
                        userGroupId={userGroupId}
                        onClose={this.handleAddTaskModalClose}
                        onTaskCreate={onTaskCreate}
                        disabledProjectChange={disabledProjectChange}
                        taskId={taskId}
                    />
                }
            </Fragment>
        );
    }
}
