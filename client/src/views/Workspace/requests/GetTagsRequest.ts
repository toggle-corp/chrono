import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Request } from '../../../rest/interface';
import { Tag } from '../../../redux/interface';
import schema from '../../../schema';
import {
    urlForTags,
    commonParamsForGet,
} from '../../../rest';

import { Workspace } from '../index';

interface Props {
    setState: Workspace['setState'];
    setUserTags(params: Tag[]): void;
}

interface TagsGetResponse {
    count: number;
    next: string;
    previous: string;
    results: Tag[];
}

export default class GetTagsRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForTags)
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ pendingTags: true }); })
            .postLoad(() => { this.props.setState({ pendingTags: false }); })
            .success((response: TagsGetResponse) => {
                try {
                    schema.validate(response, 'tagsGetResponse');
                    this.props.setUserTags(response.results);
                } catch (err) {
                    console.error(err);
                }
            })
            .build();
        return request;

    }
}
