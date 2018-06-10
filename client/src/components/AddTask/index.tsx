import React, {
    Fragment,
} from 'react';

import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton';

import { iconNames } from '../../constants';

import AddTaskModal from './AddTaskModal';

interface Props {
    disabled?: boolean;
    projectId?: number;
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

        return(
            <Fragment>
                <PrimaryButton
                    onClick={this.handleAddTaskButton}
                    transparent
                    title="Create task for a project"
                    disabled={showModal}
                    iconName={iconNames.add}
                />
                {
                    showModal &&
                    <AddTaskModal
                        projectId={this.props.projectId}
                        onClose={this.handleAddTaskModalClose}
                    />
                }
            </Fragment>
        );
    }
}
