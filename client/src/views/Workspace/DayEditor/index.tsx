import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';
import NonFieldErrors from '../../../vendor/react-store/components/Input/NonFieldErrors';
import TextInput from '../../../vendor/react-store/components/Input/TextInput';
import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import DangerButton from '../../../vendor/react-store/components/Action/Button/DangerButton';

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
    userGroupsSelector,
    setDataAction,
} from '../../../redux';
import { DayData } from '../../../redux/interface';
import { RootState, UserGroup } from '../../../redux/interface';

import styles from './styles.scss';

type DayParams = DayData;

interface WithIdAndTitle {
    id: number;
    title: string;
}

interface OwnProps {}

interface PropsFromState {
    dayData: DayParams;
    activeDay: number;
    userGroups: UserGroup[];
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
    userGroups: WithIdAndTitle[];
    projects: WithIdAndTitle[];
    tasks: WithIdAndTitle[];
}

export class DayEditor extends React.PureComponent<Props, States> {
    schema: Schema;

    static keySelector = (d: WithIdAndTitle) => d.id;
    static labelSelector = (d: WithIdAndTitle) => d.title;

    constructor(props: Props) {
        super(props);

        this.state = {
            formErrors: {},
            formFieldErrors: {},
            formValues: props.dayData,
            pending: false,
            pristine: false,
            userGroups: [
                { id: 1, title: 'User Group #1' },
            ],
            projects: [
                { id: 1, title: 'Project #1' },
                { id: 2, title: 'Project #2' },
            ],
            tasks: [
                { id: 1, title: 'Task #1' },
                { id: 2, title: 'Task #2' },
                { id: 3, title: 'Task #3' },
            ],
        };

        this.schema = {
            fields: {
                startTime: [ requiredCondition ],
                endTime: [ requiredCondition ],
                userGroup: [ requiredCondition ],
                project: [ requiredCondition ],
                task: [ requiredCondition ],
                remarks: [],
            },
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.dayData !== nextProps.dayData) {
            this.setState({ formValues: nextProps.dayData });
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
        this.setState({
            formErrors: {},
            formFieldErrors: {},
            formValues: this.props.dayData,
            pending: false,
            pristine: false,
        });
    }

    render() {
        const {
            formErrors,
            formFieldErrors,
            formValues,
            pending,

            projects,
            tasks,
        } = this.state;
        const { userGroups } = this.props;

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
                        keySelector={DayEditor.keySelector}
                        labelSelector={DayEditor.labelSelector}
                    />
                    <SelectInput
                        formname="project"
                        label="Project"
                        className={styles.project}
                        options={projects}
                        placeholder="Select a project"
                        keySelector={DayEditor.keySelector}
                        labelSelector={DayEditor.labelSelector}
                    />
                    <SelectInput
                        formname="task"
                        label="Task"
                        className={styles.task}
                        options={tasks}
                        placeholder="Select a task"
                        keySelector={DayEditor.keySelector}
                        labelSelector={DayEditor.labelSelector}
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
                        <PrimaryButton type="submit">
                            Save
                        </PrimaryButton>
                        <DangerButton onClick={this.handleDiscard}>
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
    userGroups: userGroupsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setData: (timestamp: number, params: DayParams) => dispatch(setDataAction(timestamp, params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(mapStateToProps, mapDispatchToProps)(DayEditor);
