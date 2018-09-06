import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import PrimaryButton from '../../../../vendor/react-store/components/Action/Button/PrimaryButton';
import WarningButton from '../../../../vendor/react-store/components/Action/Button/WarningButton';
import LoadingAnimation from '../../../../vendor/react-store/components/View/LoadingAnimation';
import DateFilter from '../../../../vendor/react-store/components/Input/DateFilter';
import MultiSelectInput from '../../../../vendor/react-store/components/Input/MultiSelectInput';
import Faram, {
    FaramErrors,
    FaramSchema,
} from '../../../../vendor/react-store/components/General/Faram';
import {
    requiredCondition,
} from '../../../../vendor/react-store/components/General/Faram/validations';
import NonFieldErrors from '../../../../vendor/react-store/components/Input/NonFieldErrors';
import { isObjectEmpty } from '../../../../vendor/react-store/utils/common';

import {
    usersSelector,
    setDayWiseFiltersAction,
    dayWiseFaramSelector,
} from '../../../../redux';

import {
    RootState,
    DayWiseFilter,
    DayWiseParams,
    UserPartialInformation,
    SetDayWiseFiltersAction,
} from '../../../../redux/interface';

import * as styles from './styles.scss';

interface OwnProps {
    classNames?: string;
    loading?: boolean;
}

interface PropsFromState {
    users: UserPartialInformation[];
    faram: DayWiseFilter;
}

interface PropsFromDispatch {
    setFilters(params: SetDayWiseFiltersAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State { }

const userKeySelector = (user: UserPartialInformation) => user.id;
const userLabelSelector = (user: UserPartialInformation) => user.displayName;

export class Filter extends React.PureComponent<Props, State>{
    schema: FaramSchema;

    constructor(props: Props) {
        super(props);

        this.schema = {
            fields: {
                users: [],
                date: [requiredCondition],
            },
        };
    }

    handleFaramChange = (
        faramValues: DayWiseParams, faramErrors: FaramErrors,
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

    handleFaramSuccess = (faramValues: DayWiseParams) => {
        this.props.setFilters({
            faramValues,
            filters: faramValues,
            pristine: true,
        });
    }

    handleFaramClear = () => {
        this.props.setFilters({
            faramValues: {} as DayWiseParams,
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
            loading,
            users,
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
                <DateFilter
                    className={styles.formElement}
                    faramElementName="date"
                    label="Date"
                    showHintAndError={false}
                    showLabel
                    hideClearButton
                />
                <MultiSelectInput
                    faramElementName="users"
                    className={styles.formElement}
                    label="User"
                    options={users}
                    placeholder="Select a user"
                    keySelector={userKeySelector}
                    labelSelector={userLabelSelector}
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
    users: usersSelector(state),
    faram: dayWiseFaramSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setFilters: (params: SetDayWiseFiltersAction) =>
        dispatch(setDayWiseFiltersAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Filter);
