import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';
import NonFieldErrors from '../../../vendor/react-store/components/Input/NonFieldErrors';
import TextInput from '../../../vendor/react-store/components/Input/TextInput';
import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import DangerButton from '../../../vendor/react-store/components/Action/Button/DangerButton';
import { RestRequest } from '../../../vendor/react-store/utils/rest';

import Form, {
    requiredCondition,
} from '../../../vendor/react-store/components/Input/Form';

import {
    FormErrors,
    FormFieldErrors,
    Schema,
} from '../../../rest/interface';
import {
    workspaceActiveTimeslotSelector,
    timeslotActiveViewSelector,
    activeDaySelector,
    userGroupsSelector,
    projectsSelector,
    tasksSelector,
    setSlotAction,
    unsetSlotAction,
    setSlotViewAction,
} from '../../../redux';
import {
    RootState,
    UserGroup,
    SlotData,
    Project,
    Task,
    TimeslotView,
} from '../../../redux/interface';

import SlotGetRequest from '../requests/SlotGetRequest';
import SlotPostRequest from '../requests/SlotPostRequest';
import SlotPatchRequest from '../requests/SlotPatchRequest';

import * as styles from './styles.scss';

interface WithIdAndTitle {
    id: number;
    title: string;
}

interface OwnProps {}

interface PropsFromState {
    slotData: SlotParams;
    activeDay: string;
    slotView: TimeslotView;
    userGroups: UserGroup[];
    projects: Project[];
    tasks: Task[];
}

interface PropsFromDispatch {
    setSlot(params: SlotParams): void;
    unsetSlot(slotId: number): void;
    setSlotView(params: TimeslotView): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    pending: boolean;
    userGroups: UserGroup[];
    projects: Project[];
    tasks: Task[];
}

type SlotParams = SlotData;

export class SlotEditor extends React.PureComponent<Props, States> {
    schema: Schema;
    slotGetRequest: RestRequest;
    slotPostRequest: RestRequest;
    slotPatchRequest: RestRequest;

    static keySelector = (d: WithIdAndTitle) => d.id;
    static labelSelector = (d: WithIdAndTitle) => d.title;

    constructor(props: Props) {
        super(props);

        this.state = {
            pending: false,
            userGroups: props.userGroups,
            projects: props.projects,
            tasks: props.tasks,
        };

        this.schema = {
            fields: {
                startTime: [requiredCondition],
                endTime: [requiredCondition],
                userGroup: [requiredCondition],
                project: [requiredCondition],
                task: [requiredCondition],
                remarks: [],
            },
        };
    }

    componentWillMount() {
        const { id: slotId } = this.props.slotView.data;
        this.startSlotGetRequest(slotId);
    }

    componentWillReceiveProps(nextProps: Props) {
        const {
            userGroups: oldUserGroups,
            projects: oldProjects,
            tasks: oldTasks,
        } = this.props;
        const {
            userGroups,
            projects,
            tasks,
        } = nextProps;

        if (oldUserGroups !== userGroups) {
            this.setState({ userGroups });
        }
        if (oldProjects !== projects) {
            this.setState({ projects });
        }
        if (oldTasks !== tasks) {
            this.setState({ tasks });
        }
    }

    componentWillUnmount() {
        if (this.slotGetRequest) {
            this.slotGetRequest.stop();
        }
        if (this.slotPostRequest) {
            this.slotPostRequest.stop();
        }
        if (this.slotPatchRequest) {
            this.slotPatchRequest.stop();
        }
    }

    startSlotGetRequest = (slotId: number) => {
        if (!slotId) { return; }
        if (this.slotGetRequest) {
            this.slotGetRequest.stop();
        }
        const request = new SlotGetRequest({
            setState: v => this.setState(v),
            setSlot: this.props.setSlot,
            unsetSlot: this.props.unsetSlot,
        });
        this.slotGetRequest = request.create(slotId);
        this.slotGetRequest.start();
    }

    startSlotPostRequest = (value: SlotParams) => {
        if (this.slotPostRequest) {
            this.slotPostRequest.stop();
        }
        const request = new SlotPostRequest({
            setState: v => this.setState(v),
            setSlot: this.props.setSlot,
            handleFormError: this.handleFormError,
        });
        this.slotPostRequest = request.create(value);
        this.slotPostRequest.start();
    }

    startSlotPatchRequest = (params: { slotId: number, values: SlotParams }) => {
        if (this.slotPatchRequest) {
            this.slotPatchRequest.stop();
        }
        const request = new SlotPatchRequest({
            setState: v => this.setState(v),
            setSlot: this.props.setSlot,
            handleFormError: this.handleFormError,
        });
        this.slotPatchRequest = request.create(params);
        this.slotPatchRequest.start();
    }

    startSubmitSlotRequest = (values: SlotParams) => {
        const { id: slotId } = this.props.slotView.data;
        if (!slotId) {
            this.startSlotPostRequest(values);
        } else {
            this.startSlotPatchRequest({ slotId, values });
        }
    }

    // FORM RELATED
    handleFormChange = (
        values: SlotParams, formFieldErrors: FormFieldErrors, formErrors: FormErrors,
    ) => {
        this.props.setSlotView({
            ...this.props.slotView,
            formErrors,
            formFieldErrors,
            data: values,
            pristine: true,
        });
    }

    handleFormError = (formFieldErrors: FormFieldErrors, formErrors: FormErrors) => {
        this.props.setSlotView({
            ...this.props.slotView,
            formErrors,
            formFieldErrors,
            pristine: true,
        });
    }

    handleFormSuccess = (value: SlotParams) => {
        this.startSubmitSlotRequest({
            ...value,
            date: this.props.activeDay,
        });
    }

    handleDiscard = () => {
        const { slotData } = this.props;
        this.props.setSlotView({
            id: slotData.id,
            data: slotData,
            pristine: false,
            formErrors: {},
            formFieldErrors: {},
        });
    }

    render() {
        const {
            pending,
            userGroups,
            projects,
            tasks,
        } = this.state;
        const {
            slotView,
            slotData,
        } = this.props;
        const {
            formErrors,
            formFieldErrors,
            data: formValues,
            pristine,
        } = slotView;

        return (
            <div className={styles.dayEditor}>
                <Form
                    className={styles.dayEditorForm}
                    schema={this.schema}
                    value={formValues}
                    formErrors={formErrors}
                    fieldErrors={formFieldErrors}
                    changeCallback={this.handleFormChange}
                    successCallback={this.handleFormSuccess}
                    failureCallback={this.handleFormError}
                    disabled={pending}
                >
                    {pending && <LoadingAnimation />}
                    <NonFieldErrors formerror="" />
                    <div className={styles.timewrapper} >
                         <TextInput
                            formname="startTime"
                            label="Start"
                            placeholder="10:00"
                            type="time"
                         />
                        <TextInput
                            formname="endTime"
                            label="End"
                            placeholder="5:00"
                            type="time"
                        />
                    </div>
                    <div className={styles.infowrapper} >
                    <SelectInput
                        formname="userGroup"
                        className={styles.usergroup}
                        label="User Group"
                        options={userGroups}
                        placeholder="Select a user group"
                        keySelector={SlotEditor.keySelector}
                        labelSelector={SlotEditor.labelSelector}
                    />
                    <SelectInput
                        formname="project"
                        label="Project"
                        className={styles.project}
                        options={projects}
                        placeholder="Select a project"
                        keySelector={SlotEditor.keySelector}
                        labelSelector={SlotEditor.labelSelector}
                    />
                    <SelectInput
                        formname="task"
                        label="Task"
                        className={styles.task}
                        options={tasks}
                        placeholder="Select a task"
                        keySelector={SlotEditor.keySelector}
                        labelSelector={SlotEditor.labelSelector}
                    />
                    </div>
                    <TextInput
                        formname="remarks"
                        label="Remarks"
                        className={styles.remarks}
                        options={tasks}
                        placeholder="Remarks"
                    />
                    <div className={styles.actionButtons}>
                        <PrimaryButton
                            type="submit"
                            disabled={!pristine || pending}
                        >
                            Save
                        </PrimaryButton>
                        <DangerButton
                            onClick={this.handleDiscard}
                            disabled={!pristine || pending || !slotData.id}
                        >
                            Discard
                        </DangerButton>
                    </div>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    activeDay: activeDaySelector(state),
    userGroups: userGroupsSelector(state),
    projects: projectsSelector(state),
    tasks: tasksSelector(state),
    slotData: workspaceActiveTimeslotSelector(state),
    slotView: timeslotActiveViewSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setSlot: (params: SlotParams) => dispatch(setSlotAction(params)),
    unsetSlot: (slotId: number) => dispatch(unsetSlotAction(slotId)),
    setSlotView: (params: TimeslotView) => dispatch(setSlotViewAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(SlotEditor);
