import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import FormattedDate from '../../../vendor/react-store/components/View/FormattedDate';
import DangerButton from '../../../vendor/react-store/components/Action/Button/DangerButton';
import WarningButton from '../../../vendor/react-store/components/Action/Button/WarningButton';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import Faram, {
    FaramErrors,
    FaramSchema,
} from '../../../vendor/react-store/components/Input/Faram';
import { requiredCondition } from '../../../vendor/react-store/components/Input/Faram/validations';
import NonFieldErrors from '../../../vendor/react-store/components/Input/NonFieldErrors';
import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';
import TextInput from '../../../vendor/react-store/components/Input/TextInput';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';
import Message from '../../../vendor/react-store/components/View/Message';
import { RestRequest } from '../../../vendor/react-store/utils/rest';

import AddTask from '../../../components/AddTask';

import {
    activeWipTimeSlotSelector,
    userGroupsSelector,
    projectsSelector,
    tasksSelector,
    changeTimeSlotAction,
    ChangeTimeSlotAction,
    discardTimeSlotAction,
    deleteTimeSlotAction,
    saveTimeSlotAction,
    SaveTimeSlotAction,
} from '../../../redux';
import {
    RootState,
    UserGroup,
    Project,
    Task,
    WipTimeSlot,
} from '../../../redux/interface';
import { getCanonicalDate } from '../../../utils/map';

import SlotPostRequest from '../requests/SlotPostRequest';
import SlotDeleteRequest from '../requests/SlotDeleteRequest';
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
    changeTimeSlot(params: ChangeTimeSlotAction): void;
    discardTimeSlot(): void;
    deleteTimeSlot(): void;
    saveTimeSlot(params: SaveTimeSlotAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    pendingSave: boolean;
    pendingDelete: boolean;
}

export class SlotEditor extends React.PureComponent<Props, States> {
    schema: FaramSchema;
    submitSlotRequest: RestRequest;
    deleteSlotRequest: RestRequest;

    static keySelector = (d: WithIdAndTitle) => d.id;
    static labelSelector = (d: WithIdAndTitle) => d.title;

    constructor(props: Props) {
        super(props);

        this.state = {
            pendingSave: false,
            pendingDelete: false,
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

    componentWillUnmount() {
        if (this.submitSlotRequest) {
            this.submitSlotRequest.stop();
        }
    }

    startSubmitSlotRequest = (
        value: WipTimeSlot['faramValues'] & { date: string, id?: number },
    ) => {
        if (this.submitSlotRequest) {
            this.submitSlotRequest.stop();
        }
        const request = new SlotPostRequest({
            setState: params => this.setState(params),
            saveTimeSlot: this.props.saveTimeSlot,
            changeTimeSlot: this.props.changeTimeSlot,
        });

        this.submitSlotRequest = request.create(value);
        this.submitSlotRequest.start();
    }

    startDeleteSlotRequest = (slotId: number) => {
        if (this.deleteSlotRequest) {
            this.deleteSlotRequest.stop();
        }

        const request = new SlotDeleteRequest({
            setState: params => this.setState(params),
            deleteTimeSlot: this.props.deleteTimeSlot,
        });

        this.deleteSlotRequest = request.create(slotId);
        this.deleteSlotRequest.start();
    }

    handleFaramChange = (
        faramValues: WipTimeSlot['faramValues'], faramErrors: FaramErrors,
    ) => {
        this.props.changeTimeSlot({
            faramValues,
            faramErrors,
        });
    }

    handleFaramFailure = (faramErrors: FaramErrors) => {
        this.props.changeTimeSlot({
            faramErrors,
        });
    }

    handleFaramSuccess = (faramValues: WipTimeSlot['faramValues']) => {
        const { year, month, day, activeWipTimeSlot } = this.props;

        this.startSubmitSlotRequest({
            ...faramValues,
            id: activeWipTimeSlot ? activeWipTimeSlot.id : undefined,
            date: getCanonicalDate(year, month, day as number),
        });
    }

    handleDiscard = () => {
        this.props.discardTimeSlot();
    }

    handleDelete = () => {
        const { activeWipTimeSlot } = this.props;

        const slotId = activeWipTimeSlot ? activeWipTimeSlot.id : undefined;
        if (!slotId) {
            return;
        }

        this.startDeleteSlotRequest(slotId);
    }

    render() {
        const {
            pendingSave,
            pendingDelete,
        } = this.state;
        const {
            activeWipTimeSlot,
            userGroups,
            projects,
            tasks,
            year,
            month,
            day,
        } = this.props;

        // If there is no activeWipTimeSlot then we cannot continue
        if (!activeWipTimeSlot) {
            return (
                <Message className={styles.message}>
                    Please select something, anything!
                </Message>
            );
        }

        const {
            faramErrors,
            faramValues,
            pristine,
            hasError,
        } = activeWipTimeSlot;

        const pending = pendingSave || pendingDelete;

        return (
            <div className={styles.dayEditor}>
                <Faram
                    className={styles.dayEditorForm}
                    schema={this.schema}
                    value={faramValues}
                    error={faramErrors}
                    disabled={pending}
                    onChange={this.handleFaramChange}
                    onValidationSuccess={this.handleFaramSuccess}
                    onValidationFailure={this.handleFaramFailure}
                >
                    {pending && <LoadingAnimation />}
                    <NonFieldErrors faramElement />
                    <div className={styles.mainForm}>
                        <div className={styles.infowrapper} >
                             <TextInput
                                faramElementName="startTime"
                                className={styles.startTime}
                                label="Start"
                                placeholder="10:00"
                                type="time"
                                autoFocus
                             />
                            <TextInput
                                faramElementName="endTime"
                                className={styles.endTime}
                                label="End"
                                placeholder="5:00"
                                type="time"
                            />
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
                            <AddTask
                                // FIXME: don't access faramValues directly
                                projectId={faramValues.project}
                                disabled={pending}
                            />
                            <TextInput
                                className={styles.remarks}
                                faramElementName="remarks"
                                label="Remarks"
                                placeholder="Some remarks here"
                            />
                        </div>
                        <div className={styles.actionButtons}>
                            { activeWipTimeSlot && activeWipTimeSlot.id &&
                                <DangerButton
                                    onClick={this.handleDelete}
                                    disabled={pending}
                                >
                                    Delete
                                </DangerButton>
                            }
                            <PrimaryButton
                                type="submit"
                                disabled={pristine || pending || hasError}
                            >
                                Save
                            </PrimaryButton>
                            <WarningButton
                                onClick={this.handleDiscard}
                                disabled={pristine || pending || hasError}
                            >
                                Discard
                            </WarningButton>
                        </div>
                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.date}>
                            <FormattedDate
                                date={`${year}-${month}-${day || 1}`}
                                mode="EEE, dd"
                            />
                        </div>
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

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    changeTimeSlot: (params: ChangeTimeSlotAction) => dispatch(changeTimeSlotAction(params)),
    discardTimeSlot: () => dispatch(discardTimeSlotAction()),
    deleteTimeSlot: () => dispatch(deleteTimeSlotAction()),
    saveTimeSlot: (params: SaveTimeSlotAction) => dispatch(saveTimeSlotAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(SlotEditor);
