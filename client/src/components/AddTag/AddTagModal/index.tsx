import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import DangerButton from '../../../vendor/react-store/components/Action/Button/DangerButton';
import Modal from '../../../vendor/react-store/components/View/Modal';
import ModalBody from '../../../vendor/react-store/components/View/Modal/Body';
import ModalHeader from '../../../vendor/react-store/components/View/Modal/Header';
import { RestRequest } from '../../../vendor/react-store/utils/rest';

import NonFieldErrors from '../../../vendor/react-store/components/Input/NonFieldErrors';
import Faram, {
    FaramErrors,
    FaramValues,
    FaramSchema,
} from '../../../vendor/react-store/components/Input/Faram';
import { requiredCondition } from '../../../vendor/react-store/components/Input/Faram/validations';
import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';
import TextArea from '../../../vendor/react-store/components/Input/TextArea';
import TextInput from '../../../vendor/react-store/components/Input/TextInput';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';

import {
    projectsSelector,
    setTagAction,
} from '../../../redux';
import {
    Project,
    RootState,
    Tag,
} from '../../../redux/interface';
import { AddTagParams } from '../../../rest/interface';

import { iconNames } from '../../../constants';

import TagPostRequest from '../requests/TagPostRequest';

import * as styles from './styles.scss';

interface OwnProps{
    onClose(): void;
    projectId?: number;
    onTagCreate?(taskId: number): void;
    disabledProjectChange?: boolean;
}
interface PropsFromState{
    projects: Project[];
}
interface PropsFromDispatch {
    setTag(value: Tag): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    faramErrors: FaramErrors;
    faramValues: FaramValues;
    pending: boolean;
    pristine: boolean;
}

export class AddTagModal extends React.PureComponent<Props, State> {
    addTagRequest: RestRequest;
    schema: FaramSchema;

    static keySelector = (d: Project) => d.id;
    static labelSelector = (d: Project) => d.title;

    constructor(props: Props) {
        super(props);

        this.schema = {
            fields: {
                project: [requiredCondition],
                title: [requiredCondition],
                description: [],
            },
        };

        let faramValues = {};
        if (props.projectId !== undefined) {
            faramValues = {
                project: props.projectId,
            };
        }
        this.state = {
            faramValues,
            faramErrors: {},
            pending: false,
            pristine: true,
        };
    }

    componentWillUnmount() {
        if (this.addTagRequest) {
            this.addTagRequest.stop();
        }
    }

    startRequestForAddTag = (values: AddTagParams) => {
        if (this.addTagRequest) {
            this.addTagRequest.stop();
        }

        const addTagRequest = new TagPostRequest({
            onClose: this.props.onClose,
            setState: params => this.setState(params),
            setTag: this.props.setTag,
            onTagCreate: this.props.onTagCreate,
        });

        this.addTagRequest = addTagRequest.create(values);
        this.addTagRequest.start();
    }

    handleFaramChange = (
        faramValues: AddTagParams,
        faramErrors: FaramErrors,
    ) => {
        this.setState({
            faramValues,
            faramErrors,
            pristine: false,
        });
    }

    handleFaramFailure = (faramErrors: FaramErrors) => {
        this.setState({
            faramErrors,
            pristine: false,
        });
    }

    handleFaramSuccess = (values: AddTagParams) => {
        this.startRequestForAddTag(values);
    }

    render() {
        const {
            faramValues,
            faramErrors,
            pending,
            pristine,
        } = this.state;
        const { disabledProjectChange } = this.props;

        const { projects } = this.props;

        return (
            <Modal
                closeOnEscape
                onClose={this.props.onClose}
            >
                <ModalHeader
                    title="Create Tag"
                    rightComponent={
                        <DangerButton
                            onClick={this.props.onClose}
                            title="Close Modal"
                            transparent
                            iconName={iconNames.close}
                        />
                    }
                />
                <ModalBody>
                    <Faram
                        className={styles.addTagForm}
                        schema={this.schema}
                        disabled={pending}
                        value={faramValues}
                        error={faramErrors}
                        onChange={this.handleFaramChange}
                        onValidationSuccess={this.handleFaramSuccess}
                        onValidationFailure={this.handleFaramFailure}
                    >
                        {pending && <LoadingAnimation />}
                        <NonFieldErrors faramElement />
                        <SelectInput
                            faramElementName="project"
                            label="Project"
                            options={projects}
                            placeholder="Select a project"
                            keySelector={AddTagModal.keySelector}
                            labelSelector={AddTagModal.labelSelector}
                            disabled={disabledProjectChange || pending}
                        />
                        <TextInput
                            faramElementName="title"
                            label="Title"
                            placeholder="Tag Title"
                            autoFocus
                        />
                        <TextArea
                            faramElementName="description"
                            label="Description"
                            placeholder="Tag Description"
                        />
                        <div className={styles.actionButtons}>
                            <DangerButton
                                className={styles.actionButton}
                                onClick={this.props.onClose}
                                disabled={pending}
                            >
                                Cancel
                            </DangerButton>
                            <PrimaryButton
                                className={styles.actionButton}
                                type="submit"
                                disabled={pristine || pending}
                            >
                                Save
                            </PrimaryButton>
                        </div>
                    </Faram>
                </ModalBody>
            </Modal>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    projects: projectsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setTag: (params: Tag) => dispatch(setTagAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(AddTagModal);
