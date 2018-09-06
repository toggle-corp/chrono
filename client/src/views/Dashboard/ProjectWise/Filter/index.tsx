import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import MultiSelectInput from '../../../../vendor/react-store/components/Input/MultiSelectInput';
import PrimaryButton from '../../../../vendor/react-store/components/Action/Button/PrimaryButton';
import WarningButton from '../../../../vendor/react-store/components/Action/Button/WarningButton';
import LoadingAnimation from '../../../../vendor/react-store/components/View/LoadingAnimation';
import DateFilter from '../../../../vendor/react-store/components/Input/DateFilter';
import Faram, {
    FaramErrors,
    FaramSchema,
} from '../../../../vendor/react-store/components/General/Faram';
import NonFieldErrors from '../../../../vendor/react-store/components/Input/NonFieldErrors';
import { isObjectEmpty } from '../../../../vendor/react-store/utils/common';

import {
    projectsSelector,
    setProjectWiseFiltersAction,
    projectWiseFaramSelector,
} from '../../../../redux';

import {
    RootState,
    Project,
    ProjectWiseFilter,
    ProjectWiseParams,
    SetProjectWiseFiltersAction,
} from '../../../../redux/interface';

import * as styles from './styles.scss';

interface OwnProps {
    classNames?: string;
    loading?: boolean;
}

interface PropsFromState {
    projects: Project[];
    faram: ProjectWiseFilter;
}

interface PropsFromDispatch {
    setFilters(params: SetProjectWiseFiltersAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State { }

const projectKeySelector = (project: Project) => project.id;
const projectLabelSelector = (project: Project) => project.title;

export class Filter extends React.PureComponent<Props, State>{
    schema: FaramSchema;

    constructor(props: Props) {
        super(props);

        this.schema = {
            fields: {
                project: [],
                date: [],
            },
        };
    }

    handleFaramChange = (
        faramValues: ProjectWiseParams, faramErrors: FaramErrors,
    ) => {
        this.props.setFilters({
            faramValues,
            faramErrors,
            pristine: false,
        });
    }

    handleFaramFailure = (faramErrors: FaramErrors) => {
        this.props.setFilters({
            faramErrors,
            pristine: true,
        });
    }

    handleFaramSuccess = (faramValues: ProjectWiseParams) => {
        this.props.setFilters({
            faramValues,
            filters: faramValues,
            pristine: true,
        });
    }

    handleFaramClear = () => {
        this.props.setFilters({
            faramValues: {} as ProjectWiseParams,
            pristine: false,
        });
    }

    /*
    handleFaramDiscard = () => {
        this.props.setFilters({
            faramValues: this.props.faram.filters,
            pristine: true,
        });
    }
    */

    render() {
        const {
            projects,
            loading,
            faram,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = faram;

        const isFilterEmpty = isObjectEmpty(faramValues);

        return (
            <Faram
                className={styles.filter}
                onChange={this.handleFaramChange}
                onValidationFailure={this.handleFaramFailure}
                onValidationSuccess={this.handleFaramSuccess}
                schema={this.schema}
                value={faramValues}
                error={faramErrors}
                disabled={loading}
            >
                {loading && <LoadingAnimation />}
                <NonFieldErrors faramElement />
                <MultiSelectInput
                    faramElementName="project"
                    className={styles.formElement}
                    label="Project"
                    options={projects}
                    placeholder="Select a project"
                    keySelector={projectKeySelector}
                    labelSelector={projectLabelSelector}
                />
                <DateFilter
                    className={styles.formElement}
                    faramElementName="date"
                    label="Date"
                    showHintAndError={false}
                    showLabel
                />
                <PrimaryButton
                    type="submit"
                    disabled={pristine || loading}
                >
                    Apply
                </PrimaryButton>
                <WarningButton
                    onClick={this.handleFaramClear}
                    disabled={isFilterEmpty || loading}
                >
                    Clear
                </WarningButton>
                {/*
                <WarningButton
                    onClick={this.handleFaramDiscard}
                    disabled={pristine || loading}
                >
                    Discard
                </WarningButton>
                */}
            </Faram>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    projects: projectsSelector(state),
    faram: projectWiseFaramSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setFilters: (params: SetProjectWiseFiltersAction) =>
        dispatch(setProjectWiseFiltersAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Filter);
