import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';
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

    success = (userGroupId: number) => (response: Member) => {
        try {
            schema.validate(response, 'groupMembershipPostResponse');
            this.props.setMember({
                userGroupId,
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
            .success(this.success(body.group))
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
