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
} from '../../../rest/interface';
import {
    UnsetUserGroupProjectAction,
} from '../../../redux/interface';
import {
    UserGroupProjects,
} from '../UserGroupProjects';

interface Props {
    setState: UserGroupProjects['setState'];
    unsetProject(params: UnsetUserGroupProjectAction): void;
}

export default class ProjectDeleteRequest implements Request<UnsetUserGroupProjectAction> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (params: UnsetUserGroupProjectAction) => () => {
        this.props.unsetProject(params);
    }

    failure = () => {
        notify.send({
            title: 'Project Delete',
            type: notify.type.ERROR,
            message: 'Failed to delete the Project',
            duration: notify.duration.MEDIUM,
        });
    }

    fatal = () => {
        notify.send({
            title: 'Project Delete',
            type: notify.type.ERROR,
            message: 'Failed to delete the Project',
            duration: notify.duration.SLOW,
        });
    }

    create = ({ projectId }: UnsetUserGroupProjectAction): RestRequest => {
        const url = createUrlForProject(projectId);
        const request = new FgRestBuilder()
            .url(url)
            .params(commonParamsForDelete)
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success({ projectId }))
            .failure(this.failure)
            .fatal(this.fatal)
            .build();

        return request;
    }
}
