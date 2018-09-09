import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import {
    RootState,
    UserInformation,
    SetUserAction,
} from '../../../redux/interface';
import { PatchUserBody } from '../../../rest/interface';

import Faram, {
    FaramErrors,
    FaramValues,
    FaramSchema,
} from '#rscg/Faram';
import {
    requiredCondition,
} from '#rscg/Faram/validations';
import LoadingAnimation from '#rscv/LoadingAnimation';
import NonFieldErrors from '#rsci/NonFieldErrors';
import TextInput from '#rsci/TextInput';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';
import { RestRequest } from '#rsu/rest';

import {
    userIdFromRouteSelector,
    userProfileInformationSelector,
    setUserAction,
} from '../../../redux';

import UserPatchRequest from '../requests/UserPatchRequest';
import * as styles from './styles.scss';

interface OwnProps {
    handleClose() : void;
}
interface PropsFromState {
    userId?: number;
    information?: UserInformation;
}
interface PropsFromDispatch {
    setUser(params: SetUserAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    faramErrors: FaramErrors;
    faramValues: FaramValues;
    pristine: boolean;
    pending: boolean;
}

export class ProfileEdit extends React.PureComponent<Props, States> {
    userPatchRequest: RestRequest;
    schema: FaramSchema;

    constructor(props: Props) {
        super(props);

        this.state = {
            faramErrors: {},
            faramValues: props.information  || {},
            pending: false,
            pristine: true,
        };

        this.schema = {
            fields: {
                firstName: [requiredCondition],
                lastName: [requiredCondition],
            },
        };
    }

    componentWillUnmount() {
        if (this.userPatchRequest) {
            this.userPatchRequest.stop();
        }
    }

    startRequestForUserPatch = (userId: number, value: PatchUserBody) => {
        if (this.userPatchRequest) {
            this.userPatchRequest.stop();
        }
        const request = new UserPatchRequest({
            userId,
            setUser: this.props.setUser,
            handleClose: this.props.handleClose,
            setState: v => this.setState(v),
        });
        this.userPatchRequest = request.create(value);
        this.userPatchRequest.start();
    }

    // Faram RELATED

    handleFaramChange = (
        values: PatchUserBody, faramErrors: FaramErrors,
    ) => {
        this.setState({
            faramErrors,
            faramValues: values,
            pristine: false,
        });
    }

    handleFaramError = (faramErrors: FaramErrors) => {
        this.setState({
            faramErrors,
            pristine: false,
        });
    }

    handleFaramSubmit = (value: PatchUserBody) => {
        const { userId } = this.props;
        if (userId) {
            this.startRequestForUserPatch(userId, value);
        }
    }

    render() {
        const {
            faramErrors,
            faramValues,
            pending,
            pristine,
        } = this.state;

        const {
            handleClose,
        } = this.props;

        return (
            <Faram
                className={styles.profileEditForm}
                schema={this.schema}
                value={faramValues}
                error={faramErrors}
                onChange={this.handleFaramChange}
                onValidationSuccess={this.handleFaramSubmit}
                onValidationFailure={this.handleFaramError}
                disabled={pending}
            >
                {pending && <LoadingAnimation />}
                <NonFieldErrors faramElement />
                <TextInput
                    faramElementName="firstName"
                    label="First Name"
                    placeholder=""
                    autoFocus
                />
                <TextInput
                    faramElementName="lastName"
                    label="Last Name"
                    placeholder=""
                />
                <div className={styles.actionButtons}>
                    <DangerButton
                        className={styles.actionButton}
                        onClick={handleClose}
                        disabled={pending}
                    >
                        Cancel
                    </DangerButton>
                    <PrimaryButton
                        className={styles.actionButton}
                        type="submit"
                        disabled={pristine || pending}
                    >
                        Save
                    </PrimaryButton>
                </div>
            </Faram>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    information: userProfileInformationSelector(state),
    userId: userIdFromRouteSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setUser: (params: SetUserAction) => dispatch(setUserAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(ProfileEdit);
