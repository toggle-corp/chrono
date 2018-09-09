import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';
import notify from '../../../notify';

import {
    createUrlForProject,
    commonParamsForGet,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import {
    SetProjectAction,
    Project as ProjectInterface,
} from '../../../redux/interface';
import { Project } from '../../Project';

interface Props {
    setState: Project['setState'];
    setProject(params: SetProjectAction): void;
}

export default class GetProjectRequest implements Request<number> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (project: ProjectInterface) => {
        // FIXME: Schema
        this.props.setProject({ project });
    }

    failure = () => {
        notify.send({
            title: 'Project',
            type: notify.type.ERROR,
            message: 'Failed to retrive Project',
            duration: notify.duration.MEDIUM,
        });
    }

    fatal = () => {
        notify.send({
            title: 'Project',
            type: notify.type.ERROR,
            message: 'Failed to retrive Project',
            duration: notify.duration.SLOW,
        });
    }

    create = (projectId: number): RestRequest => {
        const request = new FgRestBuilder()
            .url(createUrlForProject(projectId))
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ loadingProject: true }); })
            .postLoad(() => { this.props.setState({ loadingProject: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
