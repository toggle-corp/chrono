import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';
import {
    urlForUserGroups,
    createParamsForPostUserGroup,
    alterResponseErrorToFaramError,
} from '../../../rest';
import {
    Request,
    PostUserGroupBody,
    ErrorsFromServer,
} from '../../../rest/interface';
import {
    UserGroup,
    SetUserGroupAction,
} from '../../../redux/interface';

import schema from '../../../schema';

import { UserUserGroupAdd } from '../UserUserGroupAdd';

interface Props {
    userId?: number;
    setState: UserUserGroupAdd['setState'];
    setUserGroup(params: SetUserGroupAction): void;
    handleClose(): void;
}

export default class UserGroupPostRequest implements Request<PostUserGroupBody> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: UserGroup) => {
        try {
            schema.validate(response, 'userGroupPostResponse');
            this.props.setUserGroup({
                userId: this.props.userId,
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

    create = (body: PostUserGroupBody): RestRequest => {
        // FIXME: add required fields only
        const request = new FgRestBuilder()
            .url(urlForUserGroups)
            .params(createParamsForPostUserGroup(body))
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
