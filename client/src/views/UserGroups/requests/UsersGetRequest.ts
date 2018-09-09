import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';

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

import { MemberAdd } from '../MemberAdd';

interface Props {
    setState: MemberAdd['setState'];
    setUsers(params: SetUsersAction): void;
}

interface UsersGetResponse {
    count: number;
    next: string;
    previous: string;
    results: UserPartialInformation[];
}

export default class UsersGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForUsersSimplified)
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
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
