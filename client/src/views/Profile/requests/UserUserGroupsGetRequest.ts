import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';
import {
    createUrlForUserGroups,
    commonParamsForGet,
} from '../../../rest';
import {
    Request,
} from '../../../rest/interface';
import {
    UserUserGroup,
    SetUserAction,
} from '../../../redux/interface';

import schema from '../../../schema';
import notify from '../../../notify';

import { Profile } from '../index';

interface Props {
    setState: Profile['setState'];
    setUser(params: SetUserAction): void;
}

export default class UserGroupsRequest implements Request<number> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (userId: number) => (response: { results: UserUserGroup[] }) => {
        try {
            schema.validate(response, 'userGroupsResponse');
            this.props.setUser({
                userId,
                userGroups: response.results,
            });
        } catch (err) {
            console.error(err);
        }
    }

    failure = () => {
        // Show error from server
        notify.send({
            title: 'User Groups',
            type: notify.type.ERROR,
            message: 'Failed when trying to pull list of user\'s groups',
            duration: notify.duration.SLOW,
        });
    }

    fatal = () => {
        notify.send({
            title: 'User Groups',
            type: notify.type.ERROR,
            message: 'Failed when trying to pull list of user\'s groups',
            duration: notify.duration.SLOW,
        });
    }

    create = (userId: number): RestRequest => {
        // FIXME: add required fields only
        const url = createUrlForUserGroups({ user: userId });
        const request = new FgRestBuilder()
            .url(url)
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ userGroupPending: true }); })
            .postLoad(() => { this.props.setState({ userGroupPending: false }); })
            .success(this.success(userId))
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
