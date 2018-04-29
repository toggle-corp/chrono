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
import Faram, {
    requiredCondition,
} from '../../../vendor/react-store/components/Input/Faram';

import {
    FaramErrors,
    Schema,
} from '../../../rest/interface';
import {
    activeWipTimeSlotSelector,
    userGroupsSelector,
    projectsSelector,
    tasksSelector,
    changeTimeSlotAction,
    ChangeTimeSlotAction,
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
import { getWeekDayName, getCanonicalDate } from '../../../utils/map';

import SlotPostRequest from '../requests/SlotPostRequest';
import * as styles from './styles.scss';

interface WithIdAndTitle {
    id: number;
    title: string;
}

interface OwnProps {
    year: number;
    month: number;
    day?: number;
    weekDay?: number;
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
    saveTimeSlot(params: SaveTimeSlotAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    pendingSave: boolean;
}

export class SlotEditor extends React.PureComponent<Props, States> {
    schema: Schema;
    submitSlotRequest: RestRequest;

    static keySelector = (d: WithIdAndTitle) => d.id;
    static labelSelector = (d: WithIdAndTitle) => d.title;

    constructor(props: Props) {
        super(props);

        this.state = {
            pendingSave: false,
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

    startSubmitSlotRequest = (value: WipTimeSlot['faramValues'] & { date: string }) => {
        if (this.submitSlotRequest) {
            this.submitSlotRequest.stop();
        }
        // TODO: check if id already exits, in which case PUT request is sent
        const request = new SlotPostRequest({
            setState: params => this.setState(params),
            saveTimeSlot: this.props.saveTimeSlot,
        });
        this.submitSlotRequest = request.create(value);
        this.submitSlotRequest.start();
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
        const { year, month, day } = this.props;
        this.startSubmitSlotRequest({
            ...faramValues,
            date: getCanonicalDate(year, month, day as number),
        });
    }

    handleDiscard = () => {
        // TODO:
        console.warn('Should discard data');
    }

    render() {
        const { pendingSave } = this.state;
        const {
            activeWipTimeSlot,
            userGroups,
            projects,
            tasks,
            weekDay,
            day,
        } = this.props;

        // If there is no activeWipTimeSlot then we cannot continue
        if (!activeWipTimeSlot) {
            return null;
        }

        const {
            faramErrors,
            faramValues,
            pristine,
            hasError,
        } = activeWipTimeSlot;

        return (
            <div className={styles.dayEditor}>
                <Faram
                    className={styles.dayEditorForm}
                    schema={this.schema}
                    value={faramValues}
                    error={faramErrors}
                    disabled={pendingSave}
                    onChange={this.handleFaramChange}
                    onValidationSuccess={this.handleFaramSuccess}
                    onValidationFailure={this.handleFaramFailure}
                >
                    {pendingSave && <LoadingAnimation />}
                    <div className={styles.mainForm}>
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
                                disabled={pristine || pendingSave || hasError}
                            >
                                Save
                            </PrimaryButton>
                            <DangerButton
                                onClick={this.handleDiscard}
                                disabled={pristine || pendingSave || hasError}
                            >
                                Discard
                            </DangerButton>
                        </div>
                    </div>
                    <div className={styles.bottom}>
                        { weekDay !== undefined &&
                            <div className={styles.date}>
                                {getWeekDayName(weekDay)},{day}
                            </div>
                        }
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
    saveTimeSlot: (params: SaveTimeSlotAction) => dispatch(saveTimeSlotAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(SlotEditor);
