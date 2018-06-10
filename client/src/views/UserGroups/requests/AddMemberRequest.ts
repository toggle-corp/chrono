import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';
import {
    urlForGroupMembership,
    createParamsForPostGroupMembership,
    alterResponseErrorToFaramError,
} from '../../../rest';
import {
    Request,
    PostGroupMembershipBody,
    ErrorsFromServer,
} from '../../../rest/interface';
import {
    Member,
    SetUserGroupMemberAction,
} from '../../../redux/interface';

import schema from '../../../schema';

import { MemberAdd } from '../MemberAdd';

interface Props {
    userGroupId?: number;
    setState: MemberAdd['setState'];
    setMember(params: SetUserGroupMemberAction): void;
    handleClose(): void;
}

export default class AddMemberRequest implements Request<PostGroupMembershipBody> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: Member) => {
        try {
            schema.validate(response, 'groupMembershipPostResponse');
            this.props.setMember({
                userGroupId: this.props.userGroupId,
                member: response,
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

    create = (body: PostGroupMembershipBody): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForGroupMembership)
            .params(createParamsForPostGroupMembership(body))
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
