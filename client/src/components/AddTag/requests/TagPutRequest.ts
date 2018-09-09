import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';
import schema from '../../../schema';
import { Tag } from '../../../redux/interface';
import {
    Request,
    ErrorsFromServer,
    AddTagParams,
} from '../../../rest/interface';
import {
    createUrlForTag,
    createParamsForPutTag,
    alterResponseErrorToFaramError,
} from '../../../rest';

import { AddTagModal } from '../../AddTag/AddTagModal';

interface Props {
    onClose(): void;
    setState: AddTagModal['setState'];
    setTag(value: Tag): void;
    tagId: number;
}

export default class TagPutRequest implements Request < {} > {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: Tag) => {
        try {
            schema.validate(response, 'tagPostResponse');
            this.props.setTag(response);
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
            .url(createUrlForTag(this.props.tagId))
            .params(createParamsForPutTag(values))
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
