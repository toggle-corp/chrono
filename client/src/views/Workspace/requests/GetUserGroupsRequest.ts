import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { ErrorsFromServer } from '../../../rest/interface';
import WorkSpace from '../index';
import {
    urlForUserGroups,
    createParamsForUserGroups
} from '../../../rest';
import schema from '../../../schema'; 

interface Request<T> {
    create: (value: T) => RestRequest;
}

interface UserGroupsParams {
}

interface Props {
    setState: WorkSpace['setState'];
}

interface UserGroupsGetResponse {
    count: number;
    next: string;
    previous: string;
    results: [ {id: number, title: string} ];
}

export default class GetUserGroupsRequest implements Request<UserGroupsParams> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (userGroupsParams: UserGroupsParams): RestRequest => {
        const userGroupsRequest = new FgRestBuilder()
            .url(urlForUserGroups)
            .params(createParamsForUserGroups({}))
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false}); })
            .success((response: UserGroupsGetResponse) => {
                try {
                    schema.validate(response, 'userGroupsResponse');  // TODO: define this
                    console.log(response);
                } catch (err) {
                    console.error(err);
                }
            })
            .failure((response: { errors: ErrorsFromServer }) => {
                // FIXME: notify user
                console.warn('Failure: ', response);
            })
            .fatal((response: object) => {
                // FIXME: notify user
                console.warn('Fatal: ', response);
            })
            .build();
        return userGroupsRequest;

    }
}
