import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';
import {
    createUrlForProjects,
    commonParamsForGet,
} from '../../../rest';
import {
    Request,
} from '../../../rest/interface';
import {
    UserProject,
    SetUserAction,
} from '../../../redux/interface';

import schema from '../../../schema';
import notify from '../../../notify';

import { Profile } from '../index';

interface Props {
    setState: Profile['setState'];
    setUser(params: SetUserAction): void;
}

export default class ProjectsRequest implements Request<number> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (userId: number) => (response: { results: UserProject[] }) => {
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

    failure = () => {
        // FIXME: show error from server
        notify.send({
            title: 'User Projects',
            type: notify.type.ERROR,
            message: 'Failed when trying to pull list of user\'s projects',
            duration: notify.duration.SLOW,
        });
    }

    fatal = () => {
        notify.send({
            title: 'User Projects',
            type: notify.type.ERROR,
            message: 'Failed when trying to pull list of user\'s projects',
            duration: notify.duration.SLOW,
        });
    }

    create = (userId: number): RestRequest => {
        // FIXME: add required fields only
        const url = createUrlForProjects({ user: userId });
        const request = new FgRestBuilder()
            .url(url)
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ projectPending: true }); })
            .postLoad(() => { this.props.setState({ projectPending: false }); })
            .success(this.success(userId))
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
