import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import MultiSelectInput from '../../../../vendor/react-store/components/Input/MultiSelectInput';
import PrimaryButton from '../../../../vendor/react-store/components/Action/Button/PrimaryButton';
import WarningButton from '../../../../vendor/react-store/components/Action/Button/WarningButton';
import SuccessButton from '../../../../vendor/react-store/components/Action/Button/SuccessButton';
import LoadingAnimation from '../../../../vendor/react-store/components/View/LoadingAnimation';
import DateFilter from '../../../../vendor/react-store/components/Input/DateFilter';
import Faram, {
    FaramErrors,
    FaramSchema,
} from '../../../../vendor/react-store/components/General/Faram';
import { RestRequest } from '../../../../vendor/react-store/utils/rest';
import NonFieldErrors from '../../../../vendor/react-store/components/Input/NonFieldErrors';
import { isObjectEmpty } from '../../../../vendor/react-store/utils/common';
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

import Upt from '../../../Workspace/SlotEditor/Upt';

import * as styles from './styles.scss';

interface OwnProps {
    classNames?: string;
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
                date: [],
                tag: [],
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

    handleFaramSuccess = (faramValues: OverviewParams) => {
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
                    faramElementName="user"
                    className={styles.formElement}
                    label="User"
                    options={users}
                    placeholder="Select a user"
                    keySelector={userKeySelector}
                    labelSelector={userLabelSelector}
                />
                <Upt
                    userGroupId={faramValues.userGroup}
                    projectId={faramValues.project}
                    pending={loading}
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
                <SuccessButton
                    onClick={this.handleExportClick}
                    disabled={exportLoading}
                >
                    Export
                </SuccessButton>
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
