import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';
import {
    commonParamsForGet,
    createUrlForUserGroup,
} from '../../../rest';
import {
    Request,
} from '../../../rest/interface';
import {
    UserGroup,
    SetUserGroupAction,
} from '../../../redux/interface';

import schema from '../../../schema';
import notify from '../../../notify';

import { UserGroups } from '../index';

interface Props {
    setState: UserGroups['setState'];
    setUserGroup(params: SetUserGroupAction): void;
}

export default class UserGroupGetRequest implements Request<number> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (userGroupId: number)  => (response: UserGroup) => {
        try {
            schema.validate(response, 'userGroup');
            this.props.setUserGroup({
                userGroup: response,
            });
        } catch (err) {
            console.error(err);
        }
    }

    failure = () => {
        notify.send({
            title: 'User Group Profile',
            type: notify.type.ERROR,
            message: 'Failed when trying to pull user group\'s profile',
            duration: notify.duration.MEDIUM,
        });
    }

    fatal = () => {
        notify.send({
            title: 'User Group Profile',
            type: notify.type.ERROR,
            message: 'Failed when trying to pull user group\'s profile',
            duration: notify.duration.SLOW,
        });
    }

    create = (userGroupId: number): RestRequest => {
        const request = new FgRestBuilder()
            .url(createUrlForUserGroup(userGroupId))
            .params(commonParamsForGet)
            .preLoad(() => {
                this.props.setState({
                    userGroupInfoPending: true,
                });
            })
            .postLoad(() => {
                this.props.setState({
                    userGroupInfoPending: false,
                });
            })
            .success(this.success(userGroupId))
            .failure(this.failure)
            .fatal(this.fatal)
            .build();

        return request;
    }
}
