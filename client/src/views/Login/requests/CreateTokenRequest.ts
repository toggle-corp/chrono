import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Token } from '../../../redux/interface';
import {
    createParamsForTokenCreate,
    transformResponseErrorToFormError,
    urlForTokenCreate,
} from '../../../rest';
import { ErrorsFromServer } from '../../../rest/interface';
import schema from '../../../schema';

// FIXME: Move this
interface Request<T> {
    create: (value: T) => RestRequest;
}

interface AuthParams {
    email: string;
    password: string;
}

interface Props {
    login(params: Token): void;
    authenticate(): void;
}

export default class CreateTokenRequest implements Request<AuthParams> {
    setState: (value: object) => void;
    props: Props;

    constructor(mother: React.Component, props: Props) {
        this.setState = (value) => {
            mother.setState(value);
        };
        this.props = props;
    }

    // LOGIN REST API
    create = ({ email, password }: AuthParams): RestRequest => {
        const userLoginRequest = new FgRestBuilder()
            .url(urlForTokenCreate)
            .params(createParamsForTokenCreate({
                password,
                username: email,
            }))
            .preLoad(() => {
                this.setState({ pending: true, pristine: false });
            })
            .success((response: { access: string, refresh: string }) => {
                try {
                    schema.validate(response, 'tokenGetResponse');
                    const { refresh, access } = response;
                    this.props.login({ refresh, access });
                    // TODO: call refresher here
                    this.props.authenticate();
                    this.setState({ pending: false });
                } catch (err) {
                    console.error(err);
                }
            })
            .failure((response: { errors: ErrorsFromServer } ) => {
                console.info('FAILURE:', response);
                const {
                    formFieldErrors,
                    formErrors,
                } = transformResponseErrorToFormError(response.errors);
                this.setState({
                    formErrors,
                    formFieldErrors,
                    pending: false,
                });
            })
            .fatal((response: object) => {
                console.info('FATAL:', response);
                this.setState({
                    formErrors: ['Error while trying to log in.'],
                    pending: false,
                });
            })
            .build();
        return userLoginRequest;
    }
}
