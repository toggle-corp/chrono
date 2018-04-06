import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';
import notify from '../../../notify';

import {
    createUrlForProject,
    commonParamsForDelete,
} from '../../../rest';
import {
    Request,
    ErrorsFromServer,
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
        try {
            this.props.unsetProject(params);
        } catch (err) {
            console.error(err);
        }
    }

    failure = (response: { errors: ErrorsFromServer }) => {
        console.warn('FAILURE:', response);
        notify.send({
            title: 'Project Delete',
            type: notify.type.ERROR,
            message: 'Failed when trying to delete the Project',
            duration: notify.duration.MEDIUM,
        });
    }

    fatal = (response: object) => {
        console.warn('FATAL:', response);
        notify.send({
            title: 'Project Delete',
            type: notify.type.ERROR,
            message: 'Failed when trying to delete the project',
            duration: notify.duration.SLOW,
        });
    }

    create = ({ userId, project }: UnsetUserProjectAction): RestRequest => {
        // FIXME: add required fields only
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
