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
} from '../../../rest/interface';
import {
    UserInformation,
    SetUserAction,
} from '../../../redux/interface';

import schema from '../../../schema';
import notify from '../../../notify';

import { Profile } from '../index';

interface Props {
    setState: Profile['setState'];
    setUser(params: SetUserAction): void;
}

export default class UserProfileRequest implements Request<number> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (userId: number) => (response: UserInformation) => {
        try {
            schema.validate(response, 'userGetResponse');
            this.props.setUser({
                userId,
                information: response,
            });
        } catch (err) {
            console.error(err);
        }
    }

    failure = () => {
        notify.send({
            title: 'User Profile',
            type: notify.type.ERROR,
            message: 'Failed when trying to pull user\'s profile',
            duration: notify.duration.MEDIUM,
        });
    }

    fatal = () => {
        notify.send({
            title: 'User Profile',
            type: notify.type.ERROR,
            message: 'Failed when trying to pull user\'s profile',
            duration: notify.duration.SLOW,
        });
    }

    create = (userId: number): RestRequest => {
        const request = new FgRestBuilder()
            .url(createUrlForUsers(userId))
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ informationPending: true }); })
            .postLoad(() => { this.props.setState({ informationPending: false }); })
            .success(this.success(userId))
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
