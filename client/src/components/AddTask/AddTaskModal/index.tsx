import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import { RestRequest } from '#rsu/rest';

import NonFieldErrors from '#rsci/NonFieldErrors';
import Faram, {
    FaramErrors,
    FaramValues,
    FaramSchema,
} from '#rscg/Faram';
import {
    requiredCondition,
} from '#rscg/Faram/validations';
import TextArea from '#rsci/TextArea';
import TextInput from '#rsci/TextInput';
import LoadingAnimation from '#rscv/LoadingAnimation';

import {
    taskSelector,
    setTaskAction,
} from '../../../redux';
import {
    Project,
    RootState,
    Task,
} from '../../../redux/interface';
import { AddTaskParams } from '../../../rest/interface';

import { iconNames } from '../../../constants';

import Upt from '../../../views/Workspace/SlotEditor/Upt';

import TaskPostRequest from '../requests/TaskPostRequest';
import TaskGetRequest from '../requests/TaskGetRequest';
import TaskPutRequest from '../requests/TaskPutRequest';

import * as styles from './styles.scss';

interface OwnProps{
    onClose(): void;
    userGroupId?: number;
    projectId?: number;
    onTaskCreate?(taskId: number): void;
    disabledProjectChange?: boolean;
    taskId?: number;
}
interface PropsFromState{
    task?: Task;
}
interface PropsFromDispatch {
    setTask(value: Task): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    faramErrors: FaramErrors;
    faramValues: FaramValues;
    pending: boolean;
    pristine: boolean;
}

export class AddTaskModal extends React.PureComponent<Props, State> {
    taskRequest: RestRequest;
    addTaskRequest: RestRequest;
    editTaskRequest: RestRequest;
    schema: FaramSchema;

    static keySelector = (d: Project) => d.id;
    static labelSelector = (d: Project) => d.title;

    constructor(props: Props) {
        super(props);

        this.schema = {
            fields: {
                userGroup: [requiredCondition],
                project: [requiredCondition],
                title: [requiredCondition],
                description: [],
                tags: [],
            },
        };

        let faramValues = props.task ? props.task : {};
        if (props.projectId !== undefined) {
            faramValues = {
                userGroup: props.userGroupId,
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

    componentWillMount() {
        const { taskId } = this.props;
        if (taskId) {
            this.startRequestForTask(taskId);
        } else {
            this.setState({ pending: false });
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        const { task: oldTask } = this.props;
        const { task } = nextProps;
        if (task && oldTask !== task) {
            this.setState({ faramValues: task });
        }
    }

    componentWillUnmount() {
        if (this.addTaskRequest) {
            this.addTaskRequest.stop();
        }
        if (this.editTaskRequest) {
            this.editTaskRequest.stop();
        }
        if (this.taskRequest) {
            this.taskRequest.stop();
        }
    }

    startRequestForTask = (taskId: number) => {
        if (this.taskRequest) {
            this.taskRequest.stop();
        }

        const taskRequest = new TaskGetRequest({
            setState: params => this.setState(params),
            setTask: this.props.setTask,
        });

        this.taskRequest = taskRequest.create(taskId);
        this.taskRequest.start();
    }

    startRequestForAddTask = (values: AddTaskParams) => {
        if (this.addTaskRequest) {
            this.addTaskRequest.stop();
        }

        const addTaskRequest = new TaskPostRequest({
            onClose: this.props.onClose,
            setState: params => this.setState(params),
            setTask: this.props.setTask,
            onTaskCreate: this.props.onTaskCreate,
        });

        this.addTaskRequest = addTaskRequest.create(values);
        this.addTaskRequest.start();
    }

    startRequestForEditTask = (taskId: number, values: AddTaskParams) => {
        if (this.editTaskRequest) {
            this.editTaskRequest.stop();
        }
        const editTaskRequest = new TaskPutRequest({
            taskId,
            onClose: this.props.onClose,
            setState: params => this.setState(params),
            setTask: this.props.setTask,
        });

        this.editTaskRequest = editTaskRequest.create(values);
        this.editTaskRequest.start();
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
        const { taskId } = this.props;
        if (taskId) {
            this.startRequestForEditTask(taskId, values);
        } else {
            this.startRequestForAddTask(values);
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
            taskId,
        } = this.props;

        return (
            <Modal
                closeOnEscape
                onClose={this.props.onClose}
            >
                <ModalHeader
                    title={!taskId ? 'Create Task' : 'Edit Task'}
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
                        <Upt
                            userGroupId={faramValues.userGroup}
                            projectId={faramValues.project}
                            disabledProjectChange={disabledProjectChange}
                            hideTasks
                        />
                        <TextInput
                            faramElementName="title"
                            label="Title"
                            placeholder="Task Title"
                            autoFocus
                        />
                        <TextArea
                            faramElementName="description"
                            label="Description"
                            placeholder="Task Description"
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
    task: taskSelector(state, props),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setTask: (params: Task) => dispatch(setTaskAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(AddTaskModal);
