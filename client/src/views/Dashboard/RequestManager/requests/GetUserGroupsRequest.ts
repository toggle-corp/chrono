import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';

import { Request } from '../../../../rest/interface';
import {
    UserGroup,
    SetDashboardLoadingsAction,
} from '../../../../redux/interface';
import schema from '../../../../schema';
import {
    urlForUserGroups,
    commonParamsForGet,
} from '../../../../rest';

interface Props {
    setLoadings(params: SetDashboardLoadingsAction): void;
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
            .preLoad(() => { this.props.setLoadings({ userGroupsLoading: true }); })
            .postLoad(() => { this.props.setLoadings({ userGroupsLoading: false }); })
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
