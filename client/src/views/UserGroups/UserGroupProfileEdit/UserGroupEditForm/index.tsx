import React, {
    PureComponent,
} from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import {
    RootState,
    UserGroup,
    PatchUserGroupAction,
} from '../../../../redux/interface';
import {
    PatchUserGroupBody,
} from '../../../../rest/interface';

import Faram, {
    FaramErrors,
    FaramSchema,
    FaramValues,
} from '#rscg/Faram';
import {
    requiredCondition,
} from '#rscg/Faram/validations';
import NonFieldErrors from '#rsci/NonFieldErrors';
import LoadingAnimation from '#rscv/LoadingAnimation';
import TextInput from '#rsci/TextInput';
import TextArea from '#rsci/TextArea';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';

import { RestRequest } from '#rsu/rest';

import UserGroupPatchRequest from '../../requests/UserGroupPatchRequest';

import {
    userGroupIdFromRouteSelector,
    patchUserGroupAction,
} from '../../../../redux';

import * as styles from './styles.scss';

interface OwnProps{
    userGroup?: UserGroup;
    handleClose(): void;
}
interface PropsFromState{
    userGroupId?: number;
}
interface PropsFromDispatch{
    patchUserGroup(params: PatchUserGroupAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    faramErrors: FaramErrors;
    faramValues: FaramValues;
    pristine: boolean;
    pending: boolean;
}

export class UserGroupEditForm extends PureComponent<Props, States> {
    schema: FaramSchema;
    userGroupPatchRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state  = {
            faramErrors: {},
            faramValues: props.userGroup || {},
            pristine: true,
            pending: false,
        };
        this.schema = {
            fields: {
                title: [requiredCondition],
                description: [],
            },
        };
    }

    componentWillUnmount() {
        if (this.userGroupPatchRequest) {
            this.userGroupPatchRequest.stop();
        }
    }

    requestForUserGroupPatch = (userGroupId: number, values: PatchUserGroupBody) => {
        if (this.userGroupPatchRequest) {
            this.userGroupPatchRequest.stop();
        }

        const request = new UserGroupPatchRequest({
            userGroupId,
            patchUserGroup: this.props.patchUserGroup,
            handleClose: this.props.handleClose,
            setState: states => this.setState(states),
        });

        this.userGroupPatchRequest = request.create(values);
        this.userGroupPatchRequest.start();
    }

    handleFaramChange = (values: PatchUserGroupBody, faramErrors: FaramErrors) => {
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

    handleFaramSubmit = (values: PatchUserGroupBody) => {
        const { userGroupId } = this.props;
        if (userGroupId) {
            this.requestForUserGroupPatch(userGroupId, values);
        }
    }

    render() {
        const {
            pending,
            pristine,
            faramErrors,
            faramValues,
        } = this.state;

        const {
            handleClose,
        } = this.props;

        return (
            <Faram
                className={styles.editUserGroupForm}
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
                    faramElementName="title"
                    label="Title"
                    placeholder={faramValues.title}
                    autoFocus
                />
                <TextArea
                    faramElementName="description"
                    label="Description"
                    placeholder={faramValues.description}
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
    userGroupId: userGroupIdFromRouteSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    patchUserGroup: (params: PatchUserGroupAction) => dispatch(patchUserGroupAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(UserGroupEditForm);
