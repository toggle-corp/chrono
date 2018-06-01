import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import {
    createUrlForProjects,
    commonParamsForGet,
} from '../../../rest';

import {
    Request,
} from '../../../rest/interface';

import {
    Project,
    SetUserGroupProjectsAction,
} from '../../../redux/interface';

import schema from '../../../schema';
import notify from '../../../notify';

import { UserGroups } from '../index';

interface Props {
    setState: UserGroups['setState'];
    setUserGroupProjects(params: SetUserGroupProjectsAction): void;
}

export default class ProjectsGetRequest implements Request<number> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (userGroupId: number) => (response: { results: Project[] }) => {
        try {
            schema.validate(response, 'projectsGetResponse');
            this.props.setUserGroupProjects({
                userGroupId,
                projects: response.results,
            });
        } catch (err) {
            console.error(err);
        }
    }

    failure = () => {
        notify.send({
            title: 'User Group Projects',
            type: notify.type.ERROR,
            message: 'Failed when trying to pull list of user group\'s projects',
            duration: notify.duration.MEDIUM,
        });
    }

    fatal = () => {
        notify.send({
            title: 'User Projects',
            type: notify.type.ERROR,
            message: 'Failed when trying to pull list of user group\'s projects',
            duration: notify.duration.SLOW,
        });
    }

    create = (userGroupId: number): RestRequest => {
        const url = createUrlForProjects({ user_group: userGroupId });
        const request = new FgRestBuilder()
            .url(url)
            .params(commonParamsForGet)
            .preLoad(() => this.props.setState({ projectsPending: true }))
            .postLoad(() => this.props.setState({ projectsPending: false }))
            .success(this.success(userGroupId))
            .failure(this.failure)
            .fatal(this.fatal)
            .build();

        return request;
    }
}
