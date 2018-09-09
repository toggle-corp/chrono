import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import {
    RootState,
    SetUserGroupAction,
    ActiveUser,
} from '../../../redux/interface';
import { PostUserGroupBody } from '../../../rest/interface';

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
import TextArea from '#rsci/TextArea';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';
import { RestRequest } from '#rsu/rest';

import {
    setUserGroupAction,
    activeUserSelector,
} from '../../../redux';

import UserGroupPostRequest from '../requests/UserGroupPostRequest';
import * as styles from './styles.scss';

interface OwnProps {
    handleClose() : void;
}
interface PropsFromState {
    activeUser: ActiveUser;
}
interface PropsFromDispatch {
    setUserGroup(params: SetUserGroupAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    faramErrors: FaramErrors;
    faramValues: FaramValues;
    pristine: boolean;
    pending: boolean;
}

export class UserUserGroupAdd extends React.PureComponent<Props, States> {
    userGroupPostRequest: RestRequest;
    schema: FaramSchema;

    constructor(props: Props) {
        super(props);

        this.state = {
            faramErrors: {},
            faramValues: {},
            pending: false,
            pristine: true,
        };

        this.schema = {
            fields: {
                title: [requiredCondition],
                description: [],
            },
        };
    }

    componentWillUnmount() {
        if (this.userGroupPostRequest) {
            this.userGroupPostRequest.stop();
        }
    }

    startRequestForUserGroupPost = (value: PostUserGroupBody) => {
        if (this.userGroupPostRequest) {
            this.userGroupPostRequest.stop();
        }
        const request = new UserGroupPostRequest({
            userId: this.props.activeUser.userId,
            setUserGroup: this.props.setUserGroup,
            handleClose: this.props.handleClose,
            setState: v => this.setState(v),
        });
        this.userGroupPostRequest = request.create(value);
        this.userGroupPostRequest.start();
    }

    // Faram RELATED

    handleFaramChange = (
        values: PostUserGroupBody, faramErrors: FaramErrors,
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

    handleFaramSubmit = (value: PostUserGroupBody) => {
        this.startRequestForUserGroupPost(value);
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
                className={styles.userGroupAddForm}
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
                    placeholder=""
                    autoFocus
                />
                <TextArea
                    faramElementName="description"
                    label="Description"
                    placeholder=""
                    rows={3}
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
    activeUser: activeUserSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setUserGroup: (params: SetUserGroupAction) => dispatch(setUserGroupAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(UserUserGroupAdd);
