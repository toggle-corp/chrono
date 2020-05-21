import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';

import { Request } from '../../../../rest/interface';
import {
    urlForSlotFilterOptions,
    commonParamsForGet,
} from '../../../../rest';
import {
    SetUsersAction,
    UserGroup,
    Project,
    Task,
    SetDashboardLoadingsAction,
    UserPartialInformation,
} from '../../../../redux/interface';
// import schema from '../../../../schema';

interface Props {
    setLoadings(params: SetDashboardLoadingsAction): void;
    setUsers(params: SetUsersAction): void;
    setUserGroups(params: UserGroup[]): void;
    setUserProjects(params: Project[]): void;
    setUserTasks(params: Task[]): void;

}

interface Response {
    users: UserPartialInformation[];
    userGroups: UserGroup[];
    projects: Project[];
    tasks: Task[];
}

export default class GetSlotFilterOptionsRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForSlotFilterOptions)
            .params(commonParamsForGet)
            .preLoad(() => {
                this.props.setLoadings({
                    usersLoading: true,
                    tasksLoading: true,
                    userGroupsLoading: true,
                    projectsLoading: true,
                });
            })
            .postLoad(() => {
                this.props.setLoadings({
                    usersLoading: false,
                    tasksLoading: false,
                    userGroupsLoading: false,
                    projectsLoading: false,
                });
            })
            .success((response: Response) => {
                try {
                    const {
                        users,
                        userGroups,
                        projects,
                        tasks,
                    } = response;
                    // schema.validate({ results: users }, 'simplifiedUsersGetResponse');
                    this.props.setUsers({ users });
                    this.props.setUserGroups(userGroups);
                    this.props.setUserProjects(projects);
                    this.props.setUserTasks(tasks);
                } catch (err) {
                    console.error(err);
                }
            })
            .build();
        return request;

    }
}
