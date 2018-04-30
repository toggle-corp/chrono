import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Request } from '../../../rest/interface';
import { UserGroup } from '../../../redux/interface';
import schema from '../../../schema'; 
import {
    urlForUserGroups,
    commonParamsForGet,
} from '../../../rest';

import { Workspace } from '../index';

interface Props {
    setState: Workspace['setState'];
    setUserGroups(params: UserGroup[]): void;
}

interface UserGroupsGetResponse {
    count: number;
    next: string;
    previous: string;
    results: [{ id: number, title: string }];
}

export default class GetUserGroupsRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const userGroupsRequest = new FgRestBuilder()
            .url(urlForUserGroups)
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ pendingUsergroups: true }); })
            .postLoad(() => { this.props.setState({ pendingUsergroups: false }); })
            .success((response: UserGroupsGetResponse) => {
                try {
                    schema.validate(response, 'userGroupsResponse');
                    this.props.setUserGroups(response.results);
                } catch (err) {
                    console.error(err);
                }
            })
            .build();
        return userGroupsRequest;

    }
}
