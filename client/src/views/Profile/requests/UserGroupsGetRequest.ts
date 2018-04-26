import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import {
    ErrorsFromServer,
    Request,
} from '../../../rest/interface';
import { UserProjectAdd } from '../UserProjectAdd';

import {
    urlForUserGroups,
    createParamsForUserGroups,
} from '../../../rest';
import { UserGroup } from '../../../redux/interface';
import schema from '../../../schema';

interface Props {
    setState: UserProjectAdd['setState'];
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

    create = (): RestRequest => {
        const userGroupsRequest = new FgRestBuilder()
            .url(urlForUserGroups)
            .params(createParamsForUserGroups)
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success((response: UserGroupsGetResponse) => {
                try {
                    schema.validate(response, 'userGroupsResponse');
                    this.props.setUserGroups(response.results);
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