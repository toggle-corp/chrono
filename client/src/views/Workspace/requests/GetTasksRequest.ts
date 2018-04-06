import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { ErrorsFromServer } from '../../../rest/interface';
import { Workspace } from '../index';

import {
    urlForTasks,
    createParamsForGetTasks,
} from '../../../rest';
import { Task } from '../../../redux/interface';
import schema from '../../../schema'; 

// FIXME: reuse this interface
interface Request<T> {
    create: (value: T) => RestRequest;
}

interface Props {
    setState: Workspace['setState'];
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
            .params(createParamsForGetTasks)
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success((response: TasksGetResponse) => {
                try {
                    schema.validate(response, 'tasksGetResponse');
                    this.props.setUserTasks(response.results);
                } catch (err) {
                    console.error(err);
                }
            })
            .failure((response: { errors: ErrorsFromServer }) => {
                // FIXME: notify user
                console.warn('Failure: ', response);
            })
            .fatal((response: object) => {
                // FIXME: notify user
                console.warn('Fatal: ', response);
            })
            .build();
        return request;

    }
}
