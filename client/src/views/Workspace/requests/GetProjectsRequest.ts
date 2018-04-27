import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { ErrorsFromServer } from '../../../rest/interface';
import { Workspace } from '../index';

import {
    urlForProjects,
    commonParamsForGet,
} from '../../../rest';
import { Project } from '../../../redux/interface';
import schema from '../../../schema'; 

// FIXME: reuse this interface
interface Request<T> {
    create: (value: T) => RestRequest;
}

interface Props {
    setState: Workspace['setState'];
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
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success((response: ProjectsGetResponse) => {
                try {
                    schema.validate(response, 'projectsGetResponse');
                    this.props.setUserProjects(response.results);
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
