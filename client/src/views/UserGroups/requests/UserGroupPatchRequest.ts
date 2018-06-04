import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import {
    createUrlForUserGroup,
    createParamsForUserGroupPatch,
    alterResponseErrorToFaramError,
} from '../../../rest';

import {
    Request,
    PatchUserGroupBody,
    ErrorsFromServer,
} from '../../../rest/interface';

import {
    UserGroup,
    PatchUserGroupAction,
} from '../../../redux/interface';

import schema from '../../../schema';

import { UserGroupEditForm } from '../UserGroupProfileEdit/UserGroupEditForm';

interface Props {
    userGroupId: number;
    setState: UserGroupEditForm['setState'];
    patchUserGroup(params: PatchUserGroupAction): void;
    handleClose(): void;
}

export default class UserGroupPatchRequest implements Request<PatchUserGroupBody> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: UserGroup) => {
        try {
            schema.validate(response, 'userGroup');
            this.props.patchUserGroup({
                userGroupId: this.props.userGroupId,
                userGroup: response,
            });
            this.props.handleClose();
        } catch (err) {
            console.error(err);
        }
    }

    failure = (response: { errors: ErrorsFromServer }) => {
        const faramErrors = alterResponseErrorToFaramError(response.errors);
        this.props.setState({
            faramErrors,
            pending: false,
        });
    }

    fatal = () => {
        this.props.setState({
            faramErrors: { $internal: ['Some error occured.'] },
            pending: false,
        });
    }

    create = (body: PatchUserGroupBody): RestRequest => {

        const request = new FgRestBuilder()
            .url(createUrlForUserGroup(this.props.userGroupId))
            .params(createParamsForUserGroupPatch(body))
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();

        return request;
    }
}
