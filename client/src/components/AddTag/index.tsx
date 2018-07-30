import React, {
    Fragment,
} from 'react';

import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton';

import { iconNames } from '../../constants';

import AddTagModal from './AddTagModal';

interface Props {
    disabled?: boolean;
    disabledProjectChange?: boolean;
    projectId?: number;
    onTagCreate?(taskId: number): void;
    tagId?: number;
}

interface States {
    showModal: boolean;
}

export default class AddTag extends React.PureComponent<Props, States> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showModal: false,
        };
    }

    handleAddTagButton = () => {
        this.setState({ showModal: true });
    }

    handleAddTagModalClose = () => {
        this.setState({ showModal: false });
    }

    render() {
        const { showModal } = this.state;
        const {
            disabled,
            tagId,
        } = this.props;

        return(
            <Fragment>
                <PrimaryButton
                    onClick={this.handleAddTagButton}
                    transparent
                    title={!tagId ? 'Create tag for a project' : 'Edit tag for a project'}
                    disabled={showModal || disabled}
                    iconName={!tagId ? iconNames.add : iconNames.edit}
                />
                {
                    showModal &&
                    <AddTagModal
                        projectId={this.props.projectId}
                        onClose={this.handleAddTagModalClose}
                        onTagCreate={this.props.onTagCreate}
                        disabledProjectChange={this.props.disabledProjectChange}
                        tagId={tagId}
                    />
                }
            </Fragment>
        );
    }
}
