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
    ValuesFromForm,
    Schema,
} from '../../../rest/interface';
import {
    dayDataViewSelector,
    activeDaySelector,
    setDataAction,
} from '../../../redux';
import { DayData } from '../../../redux/interface';
import { RootState } from '../../../redux/interface';

import styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    dayData: DayParams;
    activeDay: number;
}
interface PropsFromDispatch {
    setData(timestamp: number, params: DayParams): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    formErrors: FormErrors;
    formFieldErrors: FormFieldErrors;
    formValues: ValuesFromForm;
    pending: boolean;
    pristine: boolean;
}

type DayParams = DayData;
interface ProjectOption {
    id: number;
    title: string;
}

type UserGroupOption = ProjectOption;
type TaskOption = ProjectOption;

export class DayEditor extends React.PureComponent<Props, States> {
    userLoginRequest: RestRequest;
    schema: Schema;

    constructor(props: Props) {
        super(props);

        this.state = {
            formErrors: {},
            formFieldErrors: {},
            formValues: props.dayData,
            pending: false,
            pristine: false,
        };

        this.schema = {
            fields: {
                startTime: [ requiredCondition ],
                endTime: [ requiredCondition ],
                userGroup: [ requiredCondition ],
                project: [ requiredCondition ],
                task: [ requiredCondition ],
                remarks: [ requiredCondition ],
            },
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.dayData !== nextProps.dayData) {
            this.setState({ formValues: nextProps.dayData });
        }
    }

    componentWillUnmount() {
        if (this.userLoginRequest) {
            this.userLoginRequest.stop();
        }
    }

    // FORM RELATED
    handleFormChange = (values: DayParams, formFieldErrors: FormFieldErrors, formErrors: FormErrors) => {
        this.setState({
            formErrors,
            formFieldErrors,
            formValues: values,
            pristine: true,
        });
    }

    handleFormError = (formFieldErrors: FormFieldErrors, formErrors: FormErrors) => {
        this.setState({
            formErrors,
            formFieldErrors,
            pristine: true,
        });
    }

    handleFormSubmit = (value: DayParams) => {
        this.props.setData(this.props.activeDay, value);
    }

    handleDiscard = () => {
        this.setState({ formValues: this.props.dayData });
    }

    userGroupKeySelector = (d: UserGroupOption) => (d || {}).id;
    projectKeySelector = (d: ProjectOption) => (d || {}).id;
    taskKeySelector = (d: TaskOption) => (d || {}).id;

    userGroupLabelSelector = (d: UserGroupOption) => (d || {}).title;
    projectLabelSelector = (d: ProjectOption) => (d || {}).title;
    taskLabelSelector = (d: TaskOption) => (d || {}).title;

    render() {
        const {
            formErrors,
            formFieldErrors,
            formValues,
            pending,
        } = this.state;

        const userGroups: object[] = [{ id: 1, title: 'the' }];
        const projects: object[] = [{ id: 1, title: 'thenav56' }];
        const tasks: object[] = [{ id: 1, title: 'thenav56' }];

        return (
            <div className={styles.dayEditor}>
                <Form
                    className={styles.dayEditorForm}
                    schema={this.schema}
                    value={formValues}
                    formErrors={formErrors}
                    fieldErrors={formFieldErrors}
                    changeCallback={this.handleFormChange}
                    successCallback={this.handleFormSubmit}
                    failureCallback={this.handleFormError}
                    disabled={pending}
                >
                    {pending && <LoadingAnimation />}
                    <NonFieldErrors formerror="" />
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
                    <SelectInput
                        formname="userGroup"
                        label="User Group"
                        options={userGroups}
                        placeholder="Select a user group for available option(s)"
                        keySelector={this.userGroupKeySelector}
                        labelSelector={this.userGroupLabelSelector}
                    />
                    <SelectInput
                        formname="project"
                        label="Project"
                        options={projects}
                        placeholder="Select a project for available option(s)"
                        keySelector={this.projectKeySelector}
                        labelSelector={this.projectLabelSelector}
                    />
                    <SelectInput
                        formname="task"
                        label="Task"
                        options={tasks}
                        placeholder="Select a task for available option(s)"
                        keySelector={this.taskKeySelector}
                        labelSelector={this.taskLabelSelector}
                    />
                    <TextInput
                        formname="remarks"
                        label="Remarks"
                        placeholder="Remarks"
                    />
                    <div className={styles.actionButtons}>
                        <PrimaryButton
                            type="submit"
                        >
                            Save
                        </PrimaryButton>
                        <DangerButton
                            type="button"
                            onClick={this.handleDiscard}
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
    dayData: dayDataViewSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setData: (timestamp: number, params: DayParams) => dispatch(setDataAction(timestamp, params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(mapStateToProps, mapDispatchToProps)(DayEditor);
