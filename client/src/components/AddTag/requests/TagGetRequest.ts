import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';
import notify from '../../../notify';
import schema from '../../../schema';
import { Tag } from '../../../redux/interface';
import {
    Request,
    ErrorsFromServer,
} from '../../../rest/interface';
import {
    createUrlForTag,
    commonParamsForGet,
} from '../../../rest';

import { AddTagModal } from '../../AddTag/AddTagModal';

interface Props {
    setState: AddTagModal['setState'];
    setTag(value: Tag): void;
}

export default class TagGetRequest implements Request < {} > {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: Tag) => {
        try {
            schema.validate(response, 'tagPostResponse');
            this.props.setTag(response);
        } catch (err) {
            console.error(err);
        }
    }

    failure = (response: { errors: ErrorsFromServer }) => {
        notify.send({
            title: 'Tag',
            type: notify.type.ERROR,
            message: 'Failed to retrive Tag',
            duration: notify.duration.MEDIUM,
        });
    }

    fatal = () => {
        notify.send({
            title: 'Tag',
            type: notify.type.ERROR,
            message: 'Failed to retrive Tag',
            duration: notify.duration.SLOW,
        });
    }

    create = (tagId: number): RestRequest => {
        const request = new FgRestBuilder()
            .url(createUrlForTag(tagId))
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
