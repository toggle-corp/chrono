import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';
import {
    createUrlForUsers,
    commonParamsForGet,
} from '../../../rest';
import {
    Request,
    ErrorsFromServer,
} from '../../../rest/interface';
import {
    UserIdFromRoute,
    User,
} from '../../../redux/interface';

import schema from '../../../schema';

import { Profile } from '../index';

interface Props {
    setState: Profile['setState'];
    setUser(params: User): void;
}

export default class UserProfileRequest implements Request<UserIdFromRoute> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: User) => {
        try {
            schema.validate(response, 'userGetResponse');
            this.props.setUser(response);
        } catch (err) {
            console.error(err);
        }
    }

    failure = (response: { errors: ErrorsFromServer }) => {
        console.warn('FAILURE:', response);
    }

    fatal = (response: object) => {
        console.warn('FATAL:', response);
    }

    create = (userId: UserIdFromRoute): RestRequest => {
        const request = new FgRestBuilder()
            .url(createUrlForUsers(userId))
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
