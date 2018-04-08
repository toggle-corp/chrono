import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';
import notify from '../../../notify';

import {
    createUrlForUserGroup,
    commonParamsForDelete,
} from '../../../rest';
import {
    Request,
} from '../../../rest/interface';
import {
    UnsetUserUserGroupAction,
} from '../../../redux/interface';

import { UserUserGroups } from '../UserUserGroups';

interface Props {
    setState: UserUserGroups['setState'];
    unsetUserGroup(params: UnsetUserUserGroupAction): void;
}

export default class UserGroupDeleteRequest implements Request<UnsetUserUserGroupAction> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (params: UnsetUserUserGroupAction) => () => {
        this.props.unsetUserGroup(params);
    }

    failure = () => {
        notify.send({
            title: 'User Group Delete',
            type: notify.type.ERROR,
            message: 'Failed when trying to delete the user group',
            duration: notify.duration.MEDIUM,
        });
    }

    fatal = () => {
        notify.send({
            title: 'User Group Delete',
            type: notify.type.ERROR,
            message: 'Failed when trying to delete the user group',
            duration: notify.duration.SLOW,
        });
    }

    create = ({ userId, userGroup }: UnsetUserUserGroupAction): RestRequest => {
        // FIXME: add required fields only
        const url = createUrlForUserGroup(userGroup.id);
        const request = new FgRestBuilder()
            .url(url)
            .params(commonParamsForDelete)
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success({ userId, userGroup }))
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
