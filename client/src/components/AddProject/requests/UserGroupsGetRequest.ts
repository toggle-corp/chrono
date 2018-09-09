import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';
import notify from '../../../notify';

import {
    ErrorsFromServer,
    Request,
} from '../../../rest/interface';
import { AddProject } from '../index';

import {
    urlForUserGroups,
    commonParamsForGet,
} from '../../../rest';
import { UserGroup } from '../../../redux/interface';
import schema from '../../../schema';

interface Props {
    setState: AddProject['setState'];
    setUserGroups(params: UserGroup[]): void;
}

interface UserGroupsGetResponse {
    count: number;
    next: string;
    previous: string;
    results: [{ id: number, title: string }];
}

export default class UserGroupsGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: UserGroupsGetResponse) => {
        try {
            schema.validate(response, 'userGroupsResponse');
            this.props.setUserGroups(response.results);
        } catch (err) {
            console.error(err);
        }
    }

    failure = (response: { errors: ErrorsFromServer }) => {
        // FIXME: show error from server
        notify.send({
            title: 'UserGroup',
            type: notify.type.ERROR,
            message: 'Failed when trying to load the Usergroups',
            duration: notify.duration.MEDIUM,
        });
    }

    fatal = () => {
        notify.send({
            title: 'UserGroup',
            type: notify.type.ERROR,
            message: 'Failed when trying to load the Usergroups',
            duration: notify.duration.SLOW,
        });
    }

    create = (): RestRequest => {
        const userGroupsRequest = new FgRestBuilder()
            .url(urlForUserGroups)
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return userGroupsRequest;
    }
}
