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
} from '../../../vendor/react-store/components/General/Faram';
import {
    requiredCondition,
} from '../../../vendor/react-store/components/General/Faram/validations';
import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';
import TextArea from '../../../vendor/react-store/components/Input/TextArea';
import TextInput from '../../../vendor/react-store/components/Input/TextInput';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';

import {
    projectsSelector,
    tagSelector,
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
import TagGetRequest from '../requests/TagGetRequest';
import TagPutRequest from '../requests/TagPutRequest';

import * as styles from './styles.scss';

interface OwnProps{
    onClose(): void;
    projectId?: number;
    onTagCreate?(taskId: number): void;
    disabledProjectChange?: boolean;
    tagId?: number;
}
interface PropsFromState{
    projects: Project[];
    tag?: Tag;
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
    editTagRequest: RestRequest;
    tagRequest: RestRequest;
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

        let faramValues = props.tag ? props.tag : {};
        if (props.projectId !== undefined) {
            faramValues = {
                project: props.projectId,
            };
        }
        this.state = {
            faramValues,
            faramErrors: {},
            pristine: true,
            pending: !!props.tagId,
        };
    }

    componentWillMount() {
        const { tagId } = this.props;
        if (tagId) {
            this.startRequestForTag(tagId);
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.tag && nextProps.tag !== this.props.tag) {
            this.setState({
                faramValues: nextProps.tag,
                faramErrors: {},
                pristine: true,
            });
        }
    }

    componentWillUnmount() {
        if (this.tagRequest) {
            this.tagRequest.stop();
        }
        if (this.addTagRequest) {
            this.addTagRequest.stop();
        }
    }

    startRequestForTag = (tagId: number) => {
        if (this.tagRequest) {
            this.tagRequest.stop();
        }

        const tagRequest = new TagGetRequest({
            setState: params => this.setState(params),
            setTag: this.props.setTag,
        });

        this.tagRequest = tagRequest.create(tagId);
        this.tagRequest.start();
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

    startRequestForEditTag = (tagId: number, values: AddTagParams) => {
        if (this.editTagRequest) {
            this.editTagRequest.stop();
        }

        const editTagRequest = new TagPutRequest({
            tagId,
            onClose: this.props.onClose,
            setState: params => this.setState(params),
            setTag: this.props.setTag,
        });

        this.editTagRequest = editTagRequest.create(values);
        this.editTagRequest.start();
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
        const { tagId } = this.props;
        if (tagId) {
            this.startRequestForEditTag(tagId, values);
        } else {
            this.startRequestForAddTag(values);
        }
    }

    render() {
        const {
            faramValues,
            faramErrors,
            pending,
            pristine,
        } = this.state;
        const {
            disabledProjectChange,
            tagId,
        } = this.props;

        const { projects } = this.props;

        return (
            <Modal
                closeOnEscape
                onClose={this.props.onClose}
            >
                <ModalHeader
                    title={!tagId ? 'Create Tag' : 'Edit Tag'}
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

const mapStateToProps = (state: RootState, props: Props) => ({
    projects: projectsSelector(state),
    tag: tagSelector(state, props),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setTag: (params: Tag) => dispatch(setTagAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(AddTagModal);
