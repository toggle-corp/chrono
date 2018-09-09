import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';

import { Request } from '../../../../rest/interface';
import {
    Task,
    SetDashboardLoadingsAction,
} from '../../../../redux/interface';
import schema from '../../../../schema';
import {
    urlForTasks,
    commonParamsForGet,
} from '../../../../rest';

interface Props {
    setLoadings(params: SetDashboardLoadingsAction): void;
    setUserTasks(params: Task[]): void;
}

interface TasksGetResponse {
    count: number;
    next: string;
    previous: string;
    results: Task[];
}

export default class GetTasksRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForTasks)
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setLoadings({ tasksLoading: true }); })
            .postLoad(() => { this.props.setLoadings({ tasksLoading: false }); })
            .success((response: TasksGetResponse) => {
                try {
                    schema.validate(response, 'tasksGetResponse');
                    this.props.setUserTasks(response.results);
                } catch (err) {
                    console.error(err);
                }
            })
            .build();
        return request;

    }
}
