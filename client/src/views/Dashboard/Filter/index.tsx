import React from 'react';
import { connect } from 'react-redux';

// import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
// import WarningButton from '../../../vendor/react-store/components/Action/Button/WarningButton';
import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';
import DateFilter from '../../../vendor/react-store/components/Input/DateFilter';
import Faram, {
    FaramErrors,
    FaramSchema,
} from '../../../vendor/react-store/components/Input/Faram';
import NonFieldErrors from '../../../vendor/react-store/components/Input/NonFieldErrors';
// import { isObjectEmpty } from '../../../vendor/react-store/utils/common';

import {
    userGroupsSelector,
    projectsSelector,
    tasksSelector,
} from '../../../redux';

import {
    RootState,
    UserGroup,
    Project,
    Task,
} from '../../../redux/interface';

import Upt from '../../Workspace/SlotEditor/Upt';
// import * as styles from './styles.scss';

interface FilterParams {
    user: number[];
    userGroup: number;
    project: number;
    task: number;
    date: {
        startDate: number;
        endDate: number;
    };
}

interface OwnProps {
    classNames?: string;
    onChange(values: any): void;
    loading?: boolean;
}

interface PropsFromState {
    userGroups: UserGroup[];
    projects: Project[];
    tasks: Task[];
}

interface PropsFromDispatch {}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    faramValues: FilterParams;
    faramErrors: FaramErrors;
    pristine: boolean;
}

export class Filter extends React.PureComponent<Props, State>{
    schema: FaramSchema;

    constructor(props: Props) {
        super(props);

        this.state = {
            faramValues: {} as FilterParams,
            faramErrors: {},
            pristine: true,
        };

        this.schema = {
            fields: {
                user: [],
                userGroup: [],
                project: [],
                task: [],
                date: [],
            },
        };
    }

    handleFaramChange = (
        faramValues: FilterParams, faramErrors: FaramErrors,
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
            pristine: true,
        });
    }

    handleFaramSuccess = (faramValues: FilterParams) => {
        this.setState({
            faramValues,
            pristine: true,
        });
        if (faramValues.date) {
            console.warn(faramValues.date);
            this.props.onChange({
                ...faramValues,
                date: undefined,
                dateGt: faramValues.date.startDate,
                dateLt: faramValues.date.endDate,
            });
        } else {
            this.props.onChange(faramValues);
        }
    }

    render() {
        const {
            userGroups,
            projects,
            tasks,
            loading,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

        // const isFilterEmpty = isObjectEmpty(faramValues);

        // TODO: ADD Users
        return (
            <Faram
                onChange={this.handleFaramChange}
                onValidationFailure={this.handleFaramFailure}
                onValidationSuccess={this.handleFaramSuccess}
                schema={this.schema}
                value={faramValues}
                error={faramErrors}
                disabled={loading}
            >
                <div>
                    {loading && <LoadingAnimation />}
                    <NonFieldErrors faramElement />
                    <Upt
                        userGroupId={faramValues.userGroup}
                        projectId={faramValues.project}
                        projects={projects}
                        tasks={tasks}
                        userGroups={userGroups}
                    />
                    <DateFilter
                        faramElementName="date"
                        label="Date"
                        showHintAndError={false}
                        showLabel
                    />
                </div>
                <div>
                    <PrimaryButton
                        type="submit"
                        disabled={pristine || loading}
                    >
                        Apply
                    </PrimaryButton>
                </div>
            </Faram>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    userGroups: userGroupsSelector(state),
    projects: projectsSelector(state),
    tasks: tasksSelector(state),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps,
)(Filter);
