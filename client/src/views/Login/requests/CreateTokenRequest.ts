import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';

import { Login } from '../index';
import { Token } from '../../../redux/interface';
import {
    createParamsForTokenCreate,
    alterResponseErrorToFaramError,
    urlForTokenCreate,
} from '../../../rest';
import {
    ErrorsFromServer,
    Request,
} from '../../../rest/interface';
import schema from '../../../schema';

interface AuthParams {
    email: string;
    password: string;
}

interface Props {
    setState: Login['setState'];
    login(params: Token): void;
    authenticate(): void;
    startTasks(): void;
}

export default class CreateTokenRequest implements Request<AuthParams> {
    props: Props;

    constructor(props: Props) {
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
                this.props.setState({ pending: true, pristine: false });
            })
            .success((response: { access: string, refresh: string }) => {
                try {
                    schema.validate(response, 'tokenGetResponse');
                    const { refresh, access } = response;
                    this.props.login({ refresh, access });
                    this.props.setState({ pending: false });

                    this.props.startTasks();

                    this.props.authenticate();
                } catch (err) {
                    console.error(err);
                }
            })
            .failure((response: { errors: ErrorsFromServer }) => {
                const faramErrors = alterResponseErrorToFaramError(response.errors);
                this.props.setState({
                    faramErrors,
                    pending: false,
                });
            })
            .fatal(() => {
                this.props.setState({
                    faramErrors: { $internal: ['Some error occured.'] },
                    pending: false,
                });
            })
            .build();
        return userLoginRequest;
    }
}
