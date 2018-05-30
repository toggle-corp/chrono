import Redux from 'redux';
import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';

import DangerButton from '../../vendor/react-store/components/Action/Button/DangerButton';
import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton';
import NonFieldErrors from '../../vendor/react-store/components/Input/NonFieldErrors';
import Faram, {
    requiredCondition,
} from '../../vendor/react-store/components/Input/Faram';
import SelectInput from '../../vendor/react-store/components/Input/SelectInput';
import TextArea from '../../vendor/react-store/components/Input/TextArea';
import TextInput from '../../vendor/react-store/components/Input/TextInput';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import Modal from '../../vendor/react-store/components/View/Modal';
import ModalBody from '../../vendor/react-store/components/View/Modal/Body';
import ModalHeader from '../../vendor/react-store/components/View/Modal/Header';
import { RestRequest } from '../../vendor/react-store/utils/rest';

import {
    AddTaskParams,
    FaramErrors,
    FaramValues,
    Schema,
} from '../../rest/interface';

import {
    Project,
    RootState,
    Task,
} from '../../redux/interface';

import {
    projectsSelector,
    setTaskAction,
} from '../../redux';

import { iconNames } from '../../constants';

import TaskPostRequest from './requests/TaskPostRequest';
import * as styles from './styles.scss';

interface OwnProps{}
interface PropsFromState{
    projects: Project[];
}
interface PropsFromDispatch {
    setTask(value: Task): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    faramErrors: FaramErrors;
    faramValues: FaramValues;
    showModal: boolean;
    pending: boolean;
    pristine: boolean;
}

export class AddTask extends React.PureComponent<Props, States> {
    addTaskRequest: RestRequest;
    schema: Schema;

    static keySelector = (d: Project) => d.id;
    static labelSelector = (d: Project) => d.title;

    constructor(props: Props) {
        super(props);
        this.state = {
            faramErrors: {},
            faramValues: {},
            pending: false,
            pristine: true,
            showModal: false,
        };

        this.schema = {
            fields: {
                project: [requiredCondition],
                title: [requiredCondition],
                description: [],
            },
        };
    }

    componentWillUnmount() {
        if (this.addTaskRequest) {
            this.addTaskRequest.stop();
        }
    }

    startRequestForAddTask = (values: AddTaskParams) => {
        if (this.addTaskRequest) {
            this.addTaskRequest.stop();
        }

        const addTaskRequest = new TaskPostRequest({
            setState: params => this.setState(params),
            setTask: this.props.setTask,
        });

        this.addTaskRequest = addTaskRequest.create(values);
        this.addTaskRequest.start();
    }

    handleFaramChange = (
        faramValues: AddTaskParams,
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

    handleFaramSuccess = (values: AddTaskParams) => {
        this.startRequestForAddTask(values);
    }

    handleAddTaskButton = () => {
        this.setState({ showModal: true });
    }

    handleAddTaskModalClose = () => {
        this.setState({
            showModal: false,

            pending: false,
            pristine: true,
            faramErrors: {},
            faramValues: {},
        });
    }

    renderForm = () => {
        const {
            faramValues,
            faramErrors,
            pending,
            pristine,
        } = this.state;

        const { projects } = this.props;

        return (
            <Faram
                className={styles.addTaskForm}
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
                    keySelector={AddTask.keySelector}
                    labelSelector={AddTask.labelSelector}
                />
                <TextInput
                    faramElementName="title"
                    label="Title"
                    placeholder="Task Title"
                />
                <TextArea
                    faramElementName="description"
                    label="Description"
                    placeholder="Task Description"
                />
                <div className={styles.actionButtons}>
                    <DangerButton
                        className={styles.actionButton}
                        onClick={this.handleAddTaskModalClose}
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
        );
    }

    render() {
        const {
            showModal,
        } = this.state;

        // tslint:disable-next-line:variable-name
        const AddTaskForm = this.renderForm;

        return(
            <Fragment>
                <PrimaryButton
                    onClick={this.handleAddTaskButton}
                    transparent
                    disabled={showModal}
                >
                    <span className={iconNames.add} />
                </PrimaryButton>
                {
                    showModal &&
                        <Modal
                            closeOnEscape
                            onClose={this.handleAddTaskModalClose}
                        >
                            <ModalHeader
                                title="Create Task"
                                rightComponent={
                                    <DangerButton
                                        onClick={this.handleAddTaskModalClose}
                                        transparent
                                        iconName={iconNames.close}
                                    />
                                }
                            />
                            <ModalBody>
                                <AddTaskForm />
                            </ModalBody>
                        </Modal>
                }
            </Fragment>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    projects: projectsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setTask: (params: Task) => dispatch(setTaskAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(AddTask);
