import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';
import notify from '../../../notify';

import {
    commonParamsForDelete,
    createUrlForGroupMembership,
} from '../../../rest';

import {
    Request,
} from '../../../rest/interface';
import {
    UnsetUserGroupMemberAction,
} from '../../../redux/interface';
import {
    UserGroupMembers,
} from '../UserGroupMembers';

interface Props {
    setState: UserGroupMembers['setState'];
    unsetMember(params: UnsetUserGroupMemberAction): void;
}

export default class MemberDeleteRequest implements Request<UnsetUserGroupMemberAction> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (params: UnsetUserGroupMemberAction) => () => {
        this.props.unsetMember(params);
    }
    // FIXME show errors from server
    failure = () => {
        notify.send({
            title: 'Delete Member',
            type: notify.type.ERROR,
            message: 'Failed to delete the Member',
        });
    }
    // FIXME show errors from server
    fatal = () => {
        notify.send({
            title: 'Delete Member',
            type: notify.type.ERROR,
            message: 'Failed to delete the Member',
            duration: notify.duration.SLOW,
        });
    }

    create = ({ userGroupId, memberId }: UnsetUserGroupMemberAction): RestRequest => {
        const url = createUrlForGroupMembership(memberId);
        const request = new FgRestBuilder()
            .url(url)
            .params(commonParamsForDelete)
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success({ userGroupId, memberId }))
            .failure(this.failure)
            .fatal(this.fatal)
            .build();

        return request;
    }
}
