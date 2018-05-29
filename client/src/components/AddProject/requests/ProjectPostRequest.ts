import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';
import {
    urlForProjects,
    createParamsForPostProject,
    alterResponseErrorToFaramError,
} from '../../../rest';
import {
    Request,
    PostProjectBody,
    ErrorsFromServer,
} from '../../../rest/interface';
import {
    Project,
    SetProjectAction,
} from '../../../redux/interface';

import schema from '../../../schema';

import { UserProjectAdd } from '../';

interface Props {
    userId?: number;
    setState: UserProjectAdd['setState'];
    setProject(params: SetProjectAction): void;
    handleClose(): void;
}

export default class ProjectPostRequest implements Request<PostProjectBody> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: Project) => {
        try {
            schema.validate(response, 'projectsPostResponse');
            this.props.setProject({
                userId: this.props.userId,
                project: response,
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

    create = (body: PostProjectBody): RestRequest => {
        // FIXME: add required fields only
        const request = new FgRestBuilder()
            .url(urlForProjects)
            .params(createParamsForPostProject(body))
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
