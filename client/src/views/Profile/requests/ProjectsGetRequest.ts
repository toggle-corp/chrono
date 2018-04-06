import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';
import {
    createUrlForProjects,
    commonParamsForGet,
} from '../../../rest';
import {
    Request,
    ErrorsFromServer,
} from '../../../rest/interface';
import {
    UserIdFromRoute,
    UserProject,
    SetUserAction,
} from '../../../redux/interface';

import schema from '../../../schema';

import { Profile } from '../index';

interface Props {
    setState: Profile['setState'];
    setUser(params: SetUserAction): void;
}

export default class ProjectsRequest implements Request<UserIdFromRoute> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (userId: UserIdFromRoute) => (response: { results: UserProject[] }) => {
        try {
            schema.validate(response, 'projectsGetResponse');
            this.props.setUser({
                userId,
                projects: response.results,
            });
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
        // FIXME: add required fields only
        const url = createUrlForProjects({ user: userId });
        const request = new FgRestBuilder()
            .url(url)
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success(userId))
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
