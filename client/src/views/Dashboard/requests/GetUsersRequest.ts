import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Dashboard } from '../index';

import { Request } from '../../../rest/interface';
import {
    urlForUsersSimplified,
    commonParamsForGet,
} from '../../../rest';
import {
    SetUsersAction,
    UserPartialInformation,
} from '../../../redux/interface';
import schema from '../../../schema';

interface Props {
    setState: Dashboard['setState'];
    setUsers(params: SetUsersAction): void;
}

interface UsersGetResponse {
    count: number;
    next: string;
    previous: string;
    results: UserPartialInformation[];
}

export default class GetUserProjectsRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForUsersSimplified)
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ pendingUsers: true }); })
            .postLoad(() => { this.props.setState({ pendingUsers: false }); })
            .success((response: UsersGetResponse) => {
                try {
                    schema.validate(response, 'simplifiedUsersGetResponse');
                    this.props.setUsers({ users: response.results });
                } catch (err) {
                    console.error(err);
                }
            })
            .build();
        return request;

    }
}
