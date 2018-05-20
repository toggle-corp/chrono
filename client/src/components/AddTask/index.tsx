import Redux from 'redux';
import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';

import PrimaryButton from '../../vendor/react-store/components/Action/Button/PrimaryButton';
import DangerButton from '../../vendor/react-store/components/Action/Button/DangerButton';
import Modal from '../../vendor/react-store/components/View/Modal';
import ModalBody from '../../vendor/react-store/components/View/Modal/Body';
import ModalHeader from '../../vendor/react-store/components/View/Modal/Header';
import { RestRequest } from '../../vendor/react-store/utils/rest';
import SelectInput from '../../vendor/react-store/components/Input/SelectInput';
import TextInput from '../../vendor/react-store/components/Input/TextInput';
import TextArea from '../../vendor/react-store/components/Input/TextArea';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import NonFieldErrors from '../../vendor/react-store/components/Input/NonFieldErrors';
import Faram, {
    requiredCondition,
} from '../../vendor/react-store/components/Input/Faram';

import {
    FaramErrors,
    FaramValues,
    Schema,
    AddTaskParams,
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

interface WithIdAndTitle {
    id: number;
    title: string;
}
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

    static keySelector = (d: WithIdAndTitle) => d.id;
    static labelSelector = (d: WithIdAndTitle) => d.title;

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
                title: [requiredCondition],
                description: [],
                project: [requiredCondition],
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
        faramValues: AddTaskParams, faramErrors: FaramErrors,
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
        this.setState({
            showModal: true,
        });
    }

    handleAddTaskModalClose = () => {
        this.setState({
            faramErrors: {},
            faramValues: {},
            showModal: false,
            pending: false,
            pristine: true,
        });
    }

    renderForm = () => {
        const {
            faramValues,
            faramErrors,
            pending,
            pristine,
        } = this.state;

        const {
            projects,
        } = this.props;

        return (
            <div className={styles.addTask}>
                <div className={styles.addTaskFormContainer}>
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
                            label="title"
                            placeholder="Title"
                        />
                        <TextArea
                            faramElementName="description"
                            label="description"
                            placeholder="Description"
                        />
                        <div className={styles.actionButtons}>
                            <PrimaryButton
                                type="submit"
                                disabled={pristine || pending}
                            >
                                Add
                            </PrimaryButton>
                            <DangerButton
                                onClick={this.handleAddTaskModalClose}
                                disabled={pristine || pending}
                            >
                                Cancel
                            </DangerButton>
                        </div>
                    </Faram>
                </div>
            </div>
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
                                title="Add Task"
                                rightComponent={
                                    <PrimaryButton
                                        onClick={this.handleAddTaskModalClose}
                                        transparent
                                    >
                                        <span className={iconNames.close} />
                                    </PrimaryButton>
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
