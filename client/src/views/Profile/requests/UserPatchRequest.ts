import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';
import {
    createUrlForUser,
    createParamsForUserPatch,
    alterResponseErrorToFaramError,
} from '../../../rest';
import {
    Request,
    PatchUserBody,
    ErrorsFromServer,
} from '../../../rest/interface';
import {
    UserInformation,
    SetUserAction,
} from '../../../redux/interface';

import schema from '../../../schema';

import { ProfileEdit } from '../ProfileEdit';

interface Props {
    userId: number;
    setState: ProfileEdit['setState'];
    setUser(params: SetUserAction): void;
    handleClose(): void;
}

export default class UserPatchRequest implements Request<PatchUserBody> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: UserInformation) => {
        try {
            schema.validate(response, 'userPostResponse');
            this.props.setUser({
                userId: this.props.userId,
                information: response,
            });
            this.props.handleClose();
        } catch (err) {
            console.error(err);
        }
    }

    failure = (response: { errors: ErrorsFromServer }) => {
        const faramErrors = alterResponseErrorToFaramError(response.errors);
        this.props.setState({
            faramErrors,
            pending: false,
        });
    }

    fatal = () => {
        this.props.setState({
            faramErrors: { $internal: ['Some error occured.'] },
            pending: false,
        });
    }

    create = (body: PatchUserBody): RestRequest => {
        const request = new FgRestBuilder()
            .url(createUrlForUser(this.props.userId))
            .params(createParamsForUserPatch(body))
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
