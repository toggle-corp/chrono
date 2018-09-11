import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import FormattedDate from '#rscv/FormattedDate';
import DangerButton from '#rsca/Button/DangerButton';
import WarningButton from '#rsca/Button/WarningButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import Faram, {
    FaramErrors,
    FaramSchema,
} from '#rscg/Faram';
import {
    requiredCondition,
} from '#rscg/Faram/validations';
import NonFieldErrors from '#rsci/NonFieldErrors';
import TimeInput from '#rsci/TimeInput';
import TextInput from '#rsci/TextInput';
import LoadingAnimation from '#rscv/LoadingAnimation';
import Message from '#rscv/Message';
import { RestRequest } from '#rsu/rest';

import {
    activeWipTimeSlotSelector,
    changeTimeSlotAction,
    discardTimeSlotAction,
    deleteTimeSlotAction,
    saveTimeSlotAction,
} from '../../../redux';
import {
    RootState,
    WipTimeSlot,
    ChangeTimeSlotAction,
    SaveTimeSlotAction,
} from '../../../redux/interface';
import { getCanonicalDate } from '../../../utils/map';

import AddTask from '../../../components/AddTask';
import AddTag from '../../../components/AddTag';

import SlotPostRequest from '../requests/SlotPostRequest';
import SlotDeleteRequest from '../requests/SlotDeleteRequest';
import Upt from './Upt';
import * as styles from './styles.scss';

interface OwnProps {
    year: number;
    month: number;
    day?: number;
    timeSlotId?: number;
}

interface PropsFromState {
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
                tags: [],
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

    handleTaskCreate = (taskId: number) => {
        const { activeWipTimeSlot } = this.props;
        if (!activeWipTimeSlot) {
            return;
        }

        const { faramValues, faramErrors } = activeWipTimeSlot;
        // FIXME: do not access faramValues directly
        this.props.changeTimeSlot({
            faramValues: {
                ...faramValues,
                task: taskId,
            },
            faramErrors: {
                ...faramErrors,
                $internal: undefined,
                task: undefined,
            },
        });
    }

    handleTagCreate = (tagId: number) => {
        const { activeWipTimeSlot } = this.props;
        if (!activeWipTimeSlot) {
            return;
        }

        const { faramValues, faramErrors } = activeWipTimeSlot;
        // FIXME: do not access faramValues directly
        this.props.changeTimeSlot({
            faramValues: {
                ...faramValues,
                // FIXME: Only add id to the array
                tags: [tagId],
            },
            faramErrors: {
                ...faramErrors,
                $internal: undefined,
                task: undefined,
            },
        });
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
            tags: faramValues.tags || [],
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
            year,
            month,
            day,
        } = this.props;

        // If there is no activeWipTimeSlot then we cannot continue
        if (!activeWipTimeSlot) {
            return (
                <Message className={styles.messageBox}>
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
                    <div className={styles.title}>
                        <NonFieldErrors faramElement />
                        <div className={styles.actionButtons}>
                            <PrimaryButton
                                type="submit"
                                disabled={pristine || pending || hasError}
                            >
                                Save
                            </PrimaryButton>
                            { activeWipTimeSlot && activeWipTimeSlot.id &&
                                <DangerButton
                                    onClick={this.handleDelete}
                                    disabled={pending}
                                >
                                    Delete
                                </DangerButton>
                            }
                            <WarningButton
                                onClick={this.handleDiscard}
                                disabled={pending}
                            >
                                Cancel
                            </WarningButton>
                        </div>

                    </div>
                    <div className={styles.mainForm}>
                        <div className={styles.infowrapper} >
                             <TimeInput
                                faramElementName="startTime"
                                className={styles.startTime}
                                label="Start"
                                placeholder="10:00"
                                type="time"
                                autoFocus
                             />
                            <TimeInput
                                faramElementName="endTime"
                                className={styles.endTime}
                                label="End"
                                placeholder="5:00"
                                type="time"
                            />
                            <Upt
                                userGroupId={faramValues.userGroup}
                                projectId={faramValues.project}
                                pending={pending}
                                taskChild={
                                    <AddTask
                                        projectId={faramValues.project}
                                        userGroupId={faramValues.userGroup}
                                        disabledProjectChange
                                        disabled={!faramValues.project || pending}
                                        onTaskCreate={this.handleTaskCreate}
                                    />
                                }
                                tagChild={
                                    <AddTag
                                        projectId={faramValues.project}
                                        disabledProjectChange
                                        disabled={!faramValues.project || pending}
                                        onTagCreate={this.handleTagCreate}
                                    />
                                }
                            />
                            <TextInput
                                className={styles.remarks}
                                faramElementName="remarks"
                                label="Remarks"
                                placeholder="Some remarks here"
                            />
                        </div>
                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.date}>
                            <FormattedDate
                                value={`${year}-${month}-${day || 1}`}
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
