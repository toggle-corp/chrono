import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';
import schema from '../../../schema';
import { Tag } from '../../../redux/interface';
import {
    Request,
    ErrorsFromServer,
    AddTagParams,
} from '../../../rest/interface';
import {
    urlForTags,
    createParamsForPostTag,
    alterResponseErrorToFaramError,
} from '../../../rest';

import { AddTagModal } from '../../AddTag/AddTagModal';

interface Props {
    onClose(): void;
    setState: AddTagModal['setState'];
    setTag(value: Tag): void;
    onTagCreate?(taskId: number): void;
}

export default class TagPostRequest implements Request < {} > {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: Tag) => {
        try {
            schema.validate(response, 'tasksPostResponse');
            this.props.setTag(response);
            if (this.props.onTagCreate) {
                this.props.onTagCreate(response.id);
            }
            this.props.onClose();
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

    create = (values: AddTagParams): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForTags)
            .params(createParamsForPostTag(values))
            .preLoad(() => {
                this.props.setState({
                    pending: true,
                    pristine: false,
                });
            })
            .postLoad(() => {
                this.props.setState({ pending: false });
            })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();

        return request;
    }
}
