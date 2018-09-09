import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';
import notify from '../../../notify';

import {
    createUrlForProject,
    commonParamsForDelete,
} from '../../../rest';
import {
    Request,
} from '../../../rest/interface';
import {
    UnsetUserProjectAction,
} from '../../../redux/interface';

import { UserProjects } from '../UserProjects';

interface Props {
    setState: UserProjects['setState'];
    unsetProject(params: UnsetUserProjectAction): void;
}

export default class ProjectDeleteRequest implements Request<UnsetUserProjectAction> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (params: UnsetUserProjectAction) => () => {
        this.props.unsetProject(params);
    }

    failure = () => {
        // FIXME: show error from server
        notify.send({
            title: 'Project Delete',
            type: notify.type.ERROR,
            message: 'Failed when trying to delete the Project',
            duration: notify.duration.SLOW,
        });
    }

    fatal = () => {
        notify.send({
            title: 'Project Delete',
            type: notify.type.ERROR,
            message: 'Failed when trying to delete the project',
            duration: notify.duration.SLOW,
        });
    }

    create = ({ userId, project }: UnsetUserProjectAction): RestRequest => {
        const url = createUrlForProject(project.id);
        const request = new FgRestBuilder()
            .url(url)
            .params(commonParamsForDelete)
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success({ userId, project }))
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
