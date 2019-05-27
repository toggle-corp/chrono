import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import MultiSelectInput from '#rsci/MultiSelectInput';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import WarningButton from '#rsca/Button/WarningButton';
import LoadingAnimation from '#rscv/LoadingAnimation';
import DateFilter from '#rsci/DateFilter';
import Faram, {
    FaramErrors,
    FaramSchema,
} from '#rscg/Faram';
import NonFieldErrors from '#rsci/NonFieldErrors';
import { isObjectEmpty } from '#rsu/common';

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
    className?: string;
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

    handleFaramSuccess = (_: any, faramValues: ProjectWiseParams) => {
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
            className,
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
                className={`${styles.filter} ${className}`}
                onChange={this.handleFaramChange}
                onValidationFailure={this.handleFaramFailure}
                onValidationSuccess={this.handleFaramSuccess}
                schema={this.schema}
                value={faramValues}
                error={faramErrors}
                disabled={loading}
            >
                {loading && <LoadingAnimation />}
                <NonFieldErrors
                    className={styles.nonFieldError}
                    faramElement
                />
                <div className={styles.form} >
                    <div className={styles.inputs} >
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
                            className={`${styles.formElement} ${styles.date}`}
                            faramElementName="date"
                            label="Date"
                            showHintAndError={false}
                            showLabel
                        />
                    </div>
                    <div className={styles.buttons} >
                        <PrimaryButton
                            className={styles.button}
                            type="submit"
                            disabled={pristine || loading}
                        >
                            Apply
                        </PrimaryButton>
                        <WarningButton
                            className={styles.button}
                            onClick={this.handleFaramClear}
                            disabled={isFilterEmpty || loading}
                        >
                            Clear
                        </WarningButton>
                    </div>
                </div>
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
