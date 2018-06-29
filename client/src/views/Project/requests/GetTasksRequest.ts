import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';
import notify from '../../../notify';

import {
    createUrlForTasks,
    commonParamsForGet,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import {
    SetProjectTasksAction,
    Task,
} from '../../../redux/interface';
import { Project } from '../../Project';

interface Props {
    setState: Project['setState'];
    setProjectTasks(params: SetProjectTasksAction): void;
}

interface ServerResponse {
    count: number;
    results: Task[];
}

export default class GetTasksRequest implements Request<number> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (projectId: number) => (response: ServerResponse) => {
        // FIXME: Schema
        this.props.setProjectTasks({
            projectId,
            tasks: response.results,
        });
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
            .url(createUrlForTasks({ project: projectId }))
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ loadingTasks: true }); })
            .postLoad(() => { this.props.setState({ loadingTasks: false }); })
            .success(this.success(projectId))
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
