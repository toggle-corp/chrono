import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';

import { Request } from '../../../../rest/interface';
import {
    urlForProjects,
    commonParamsForGet,
} from '../../../../rest';
import {
    Project,
    SetDashboardLoadingsAction,
} from '../../../../redux/interface';
import schema from '../../../../schema';

interface Props {
    setLoadings(params: SetDashboardLoadingsAction): void;
    setUserProjects(params: Project[]): void;
}

interface ProjectsGetResponse {
    count: number;
    next: string;
    previous: string;
    results: Project[];
}

export default class GetUserProjectsRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForProjects)
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setLoadings({ projectsLoading: true }); })
            .postLoad(() => { this.props.setLoadings({ projectsLoading: false }); })
            .success((response: ProjectsGetResponse) => {
                try {
                    schema.validate(response, 'projectsGetResponse');
                    this.props.setUserProjects(response.results);
                } catch (err) {
                    console.error(err);
                }
            })
            .build();
        return request;

    }
}
