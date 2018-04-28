import React from 'react';
// import Redux from 'redux';
import { connect } from 'react-redux';

import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';
import NonFieldErrors from '../../../vendor/react-store/components/Input/NonFieldErrors';
import TextInput from '../../../vendor/react-store/components/Input/TextInput';
import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import DangerButton from '../../../vendor/react-store/components/Action/Button/DangerButton';
import { RestRequest } from '../../../vendor/react-store/utils/rest';
// import SlotPostRequest from '../requests/SlotPostRequest';

import Faram, {
    requiredCondition,
} from '../../../vendor/react-store/components/Input/Faram';

import {
    // FaramErrors,
    Schema,
} from '../../../rest/interface';
import {
    activeWipTimeSlotSelector,
    userGroupsSelector,
    projectsSelector,
    tasksSelector,
} from '../../../redux';
import {
    RootState,
    UserGroup,
    Project,
    Task,
    WipTimeSlot,
} from '../../../redux/interface';

import * as styles from './styles.scss';

interface WithIdAndTitle {
    id: number;
    title: string;
}

interface OwnProps {
    year: number;
    month: number;
    day?: number;
    timeSlotId?: number;
}

interface PropsFromState {
    userGroups: UserGroup[];
    projects: Project[];
    tasks: Task[];
    activeWipTimeSlot: WipTimeSlot | undefined;
}

interface PropsFromDispatch {
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    pending: boolean;
}

export class SlotEditor extends React.PureComponent<Props, States> {
    schema: Schema;
    submitSlotRequest: RestRequest;

    static keySelector = (d: WithIdAndTitle) => d.id;
    static labelSelector = (d: WithIdAndTitle) => d.title;

    constructor(props: Props) {
        super(props);

        this.state = {
            pending: false,
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

    /*
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
    */

    /*
    handleFaramChange = (
        faramValues: SlotParams, faramErrors: FaramErrors,
    ) => {
        this.props.setSlotView({
            faramErrors,
            faramValues,
            pristine: true,
        });
    }

    handleFaramFailure = (faramErrors: FaramErrors) => {
        // FIXME: use another reducer
        this.props.setSlotView({
            faramErrors,
        });
    }

    handleFaramSuccess = (value: SlotParams) => {
        this.startSubmitSlotRequest({
            ...value,
            date: this.props.activeDay,
        });
    }

    handleDiscard = () => {
        // FIXME: use another reducer
        this.props.setSlotView({
            data: this.props.slotData,
        });
    }
    */

    render() {
        const { pending } = this.state;
        const {
            activeWipTimeSlot,
            userGroups,
            projects,
            tasks,
        } = this.props;

        // If there is no activeWipTimeSlot then we cannot continue
        if (!activeWipTimeSlot) {
            return null;
        }

        const {
            faramErrors,
            faramValues,
            pristine,
        } = activeWipTimeSlot;

        return (
            <div className={styles.dayEditor}>
                <Faram
                    className={styles.dayEditorForm}
                    schema={this.schema}
                    value={faramValues}
                    error={faramErrors}
                    disabled={pending}
                    // onChange={this.handleFaramChange}
                    // onValidationSuccess={this.handleFaramSuccess}
                    // onValidationFailure={this.handleFaramFailure}
                >
                    {pending && <LoadingAnimation />}
                    <NonFieldErrors faramElement />
                    <div className={styles.timewrapper} >
                         <TextInput
                            faramElementName="startTime"
                            label="Start"
                            placeholder="10:00"
                            type="time"
                         />
                        <TextInput
                            faramElementName="endTime"
                            label="End"
                            placeholder="5:00"
                            type="time"
                        />
                    </div>
                    <div className={styles.infowrapper} >
                    <SelectInput
                        faramElementName="userGroup"
                        className={styles.usergroup}
                        label="User Group"
                        options={userGroups}
                        placeholder="Select a user group"
                        keySelector={SlotEditor.keySelector}
                        labelSelector={SlotEditor.labelSelector}
                    />
                    <SelectInput
                        faramElementName="project"
                        label="Project"
                        className={styles.project}
                        options={projects}
                        placeholder="Select a project"
                        keySelector={SlotEditor.keySelector}
                        labelSelector={SlotEditor.labelSelector}
                    />
                    <SelectInput
                        className={styles.task}
                        faramElementName="task"
                        label="Task"
                        options={tasks}
                        placeholder="Select a task"
                        keySelector={SlotEditor.keySelector}
                        labelSelector={SlotEditor.labelSelector}
                    />
                    </div>
                    <TextInput
                        className={styles.remarks}
                        faramElementName="remarks"
                        label="Remarks"
                        placeholder="Remarks"
                    />
                    <div className={styles.actionButtons}>
                        <PrimaryButton
                            type="submit"
                            disabled={pristine || pending}
                        >
                            Save
                        </PrimaryButton>
                        <DangerButton
                            // onClick={this.handleDiscard}
                            disabled={pristine || pending}
                        >
                            Discard
                        </DangerButton>
                    </div>
                </Faram>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState, props: OwnProps) => ({
    activeWipTimeSlot: activeWipTimeSlotSelector(state, props),
    userGroups: userGroupsSelector(state),
    projects: projectsSelector(state),
    tasks: tasksSelector(state),
});

const mapDispatchToProps = (/* dispatch: Redux.Dispatch<RootState> */) => ({
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(SlotEditor);
