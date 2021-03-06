import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import MultiSelectInput from '#rsci/MultiSelectInput';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import WarningButton from '#rsca/Button/WarningButton';
import SuccessButton from '#rsca/Button/SuccessButton';
import LoadingAnimation from '#rscv/LoadingAnimation';
import DateFilter from '#rsci/DateFilter';
import Faram, {
    FaramErrors,
    FaramSchema,
} from '#rscg/Faram';
import { requiredCondition } from '#rscg/Faram/validations';
import { RestRequest } from '#rsu/rest';
import NonFieldErrors from '#rsci/NonFieldErrors';
import { isObjectEmpty } from '#rsu/common';
import ExportRequest from './requests/ExportRequest';

import {
    usersSelector,
    setOverviewFiltersAction,
    overviewFaramSelector,
    overviewFilterSelector,
} from '../../../../redux';

import {
    RootState,
    OverviewFilter,
    OverviewParams,
    UserPartialInformation,
    SetOverviewFiltersAction,
} from '../../../../redux/interface';

import UGProjectsTasks from '../Filter/UGProjectsTasks';

import * as styles from './styles.scss';

interface OwnProps {
    className?: string;
    loading?: boolean;
}

interface PropsFromState {
    users: UserPartialInformation[];
    faram: OverviewFilter;
    filters: OverviewParams;
}

interface PropsFromDispatch {
    setFilters(params: SetOverviewFiltersAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    exportLoading: boolean;
}

const userKeySelector = (user: UserPartialInformation) => user.id;
const userLabelSelector = (user: UserPartialInformation) => user.displayName;

export class Filter extends React.PureComponent<Props, State>{
    schema: FaramSchema;
    exportRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            exportLoading: false,
        };

        this.schema = {
            fields: {
                user: [],
                userGroup: [],
                project: [],
                task: [],
                date: [requiredCondition],
                tags: [],
            },
        };
    }

    startRequestForExport = (filters: OverviewParams) => {
        if (this.exportRequest) {
            this.exportRequest.stop();
        }
        const exportRequest = new ExportRequest({
            setState: (v: State) => this.setState(v),
        });
        this.exportRequest = exportRequest.create(filters);
        this.exportRequest.start();
    }

    handleFaramChange = (
        faramValues: OverviewParams, faramErrors: FaramErrors,
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

    handleFaramSuccess = (_:any, faramValues: OverviewParams) => {
        this.props.setFilters({
            faramValues,
            filters: faramValues,
            pristine: true,
        });
    }

    handleFaramClear = () => {
        this.props.setFilters({
            faramValues: {} as OverviewParams,
            pristine: false,
        });
    }

    handleExportClick = () => {
        const { filters } = this.props;
        this.startRequestForExport(filters);
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
            users,
            loading,
            faram,
            className,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = faram;

        const { exportLoading } = this.state;

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
                            faramElementName="user"
                            className={styles.formElement}
                            label="User"
                            options={users}
                            placeholder="Select a user"
                            keySelector={userKeySelector}
                            labelSelector={userLabelSelector}
                        />
                        <UGProjectsTasks
                            userGroupId={faramValues.userGroup}
                            projectIds={faramValues.project}
                            pending={loading}
                        />
                        <DateFilter
                            className={`${styles.formElement} ${styles.date}`}
                            faramElementName="date"
                            label="Date"
                            showHintAndError={false}
                            showLabel
                        />
                    </div>
                    <div className={styles.buttons}>
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
                        <SuccessButton
                            className={styles.button}
                            onClick={this.handleExportClick}
                            disabled={exportLoading}
                        >
                            Export
                        </SuccessButton>
                    </div>
                </div>
            </Faram>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    users: usersSelector(state),
    faram: overviewFaramSelector(state),
    filters: overviewFilterSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setFilters: (params: SetOverviewFiltersAction) =>
        dispatch(setOverviewFiltersAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Filter);
