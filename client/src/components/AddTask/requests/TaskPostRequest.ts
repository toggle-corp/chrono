import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';
import schema from '../../../schema';
import { Task } from '../../../redux/interface';
import {
    Request,
    ErrorsFromServer,
    AddTaskParams,
} from '../../../rest/interface';
import {
    urlForTasks,
    createParamsForPostTask,
    alterResponseErrorToFaramError,
} from '../../../rest';

import {
    AddTask,
 } from '../../AddTask';

interface Props {
    setState: AddTask['setState'];
    setTask(value: Task): void;
}

export default class TaskPostRequest implements Request < {} > {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: Task) => {
        try {
            schema.validate(response, 'tasksPostResponse');
            this.props.setTask(response);
            this.props.setState({
                faramErrors: {},
                faramValues: {},
                pending: false,
                pristine: true,
                showModal: false,
            });
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

    create = (values: AddTaskParams): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForTasks)
            .params(createParamsForPostTask(values))
            .preLoad(() => { this.props.setState({ pending: true, pristine: false }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();

        return request;
    }
}
