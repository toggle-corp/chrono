import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import {
    urlForUsers,
    commonParamsForGet,
} from '../../../rest';

import {
    Request,
} from '../../../rest/interface';

import {
    UserInformation,
} from '../../../redux/interface';

import schema from '../../../schema';
import notify from '../../../notify';

import { MemberAdd } from '../MemberAdd/index';

interface Props {
    setState: MemberAdd['setState'];
}

export default class UsersGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: { results: UserInformation[] }) => {
        try {
            schema.validate(response, 'usersGetResponse');
            this.props.setState({
                users: response.results,
            });
        } catch (err) {
            console.error(err);
        }
    }

    // FIXME show errors from server
    failure = () => {
        notify.send({
            title: 'User Group Add Member',
            type: notify.type.ERROR,
            message: 'Failed to get users list',
            duration: notify.duration.MEDIUM,
        });
    }

    // FIXME show errors from server
    fatal = () => {
        notify.send({
            title: 'User Group Add Member',
            type: notify.type.ERROR,
            message: 'Failed to get users list',
            duration: notify.duration.SLOW,
        });
    }

    create = (): RestRequest => {
        const usersRequest = new FgRestBuilder()
            .url(urlForUsers)
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();

        return usersRequest;
    }
}
