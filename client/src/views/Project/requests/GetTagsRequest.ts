import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';
import notify from '../../../notify';

import {
    createUrlForTags,
    commonParamsForGet,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import {
    SetProjectTagsAction,
    Tag,
} from '../../../redux/interface';
import { Project } from '../../Project';

interface Props {
    setState: Project['setState'];
    setProjectTags(params: SetProjectTagsAction): void;
}

interface ServerResponse {
    count: number;
    results: Tag[];
}

export default class GetTagsRequest implements Request<number> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (projectId: number) => (response: ServerResponse) => {
        // FIXME: Schema
        this.props.setProjectTags({
            projectId,
            tags: response.results,
        });
    }

    failure = () => {
        notify.send({
            title: 'Project',
            type: notify.type.ERROR,
            message: 'Failed to retrive Project\'s Tags',
            duration: notify.duration.MEDIUM,
        });
    }

    fatal = () => {
        notify.send({
            title: 'Project',
            type: notify.type.ERROR,
            message: 'Failed to retrive Project\'s Tags',
            duration: notify.duration.SLOW,
        });
    }

    create = (projectId: number): RestRequest => {
        const request = new FgRestBuilder()
            .url(createUrlForTags({ project: projectId }))
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ loadingTags: true }); })
            .postLoad(() => { this.props.setState({ loadingTags: false }); })
            .success(this.success(projectId))
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;
    }
}
