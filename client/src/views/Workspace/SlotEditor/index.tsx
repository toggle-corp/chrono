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
import SlotPostRequest from '../requests/SlotPostRequest';

import Form, {
    requiredCondition,
} from '../../../vendor/react-store/components/Input/Form';

import {
    FormErrors,
    FormFieldErrors,
    ValuesFromForm,
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
    setSlotView(params: TimeslotView): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    formErrors: FormErrors;
    formFieldErrors: FormFieldErrors;
    formValues: ValuesFromForm;
    pending: boolean;
    pristine: boolean;
    projects: Project[];
    tasks: WithIdAndTitle[];
}

type SlotParams = SlotData;

export class SlotEditor extends React.PureComponent<Props, States> {
    schema: Schema;
    submitSlotRequest: RestRequest;

    static keySelector = (d: WithIdAndTitle) => d.id;
    static labelSelector = (d: WithIdAndTitle) => d.title;

    constructor(props: Props) {
        super(props);

        const { slotView } = props;
        this.state = {
            formErrors: {},
            formFieldErrors: {},
            formValues: slotView.data,
            pending: false,
            pristine: slotView.pristine,
            projects: [],
            tasks: [],
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

    startSubmitSlotRequest = (value: SlotParams) => {
        if (this.submitSlotRequest) {
            this.submitSlotRequest.stop();
        }
        const request = new SlotPostRequest({
            setState: params => this.setState(params),
            setSlot: this.props.setSlot,
        });
        this.submitSlotRequest = request.create(value);
        this.submitSlotRequest.start();
    }

    // FORM RELATED
    handleFormChange = (
        values: SlotParams, formFieldErrors: FormFieldErrors, formErrors: FormErrors,
    ) => {
        this.props.setSlotView({
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
        this.props.setSlotView({
            data: this.props.slotData,
            pristine: false,
            formErrors: {},
            formFieldErrors: {},
        });
    }

    render() {
        const {
            pending,
        } = this.state;
        const { 
            userGroups,
            slotView,
            tasks,
            projects,
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
                            disabled={!pristine || pending}
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
    setSlotView: (params: TimeslotView) => dispatch(setSlotViewAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(SlotEditor);
