import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';
import notify from '../../../notify';
import schema from '../../../schema';
import { Task } from '../../../redux/interface';
import {
    Request,
    ErrorsFromServer,
} from '../../../rest/interface';
import {
    createUrlForTask,
    commonParamsForGet,
} from '../../../rest';

import { AddTaskModal } from '../../AddTask/AddTaskModal';

interface Props {
    setState: AddTaskModal['setState'];
    setTask(value: Task): void;
}

export default class TaskGetRequest implements Request < {} > {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: Task) => {
        try {
            schema.validate(response, 'tasksPostResponse');
            this.props.setTask(response);
        } catch (err) {
            console.error(err);
        }
    }

    failure = (response: { errors: ErrorsFromServer }) => {
        notify.send({
            title: 'Task',
            type: notify.type.ERROR,
            message: 'Failed to retrive Task',
            duration: notify.duration.MEDIUM,
        });
    }

    fatal = () => {
        notify.send({
            title: 'Task',
            type: notify.type.ERROR,
            message: 'Failed to retrive Task',
            duration: notify.duration.SLOW,
        });
    }

    create = (taskId: number): RestRequest => {
        const request = new FgRestBuilder()
            .url(createUrlForTask(taskId))
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
