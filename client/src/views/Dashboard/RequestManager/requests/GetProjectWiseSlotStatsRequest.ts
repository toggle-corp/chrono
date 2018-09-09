import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

import { Request } from '../../../../rest/interface';
import {
    ProjectWiseSlotStat,
    SetProjectWiseSlotStatsAction,
    SetDashboardLoadingsAction,
    ProjectWiseParams,
} from '../../../../redux/interface';
import {
    createUrlForProjectWiseSlotStats,
    commonParamsForGet,
} from '../../../../rest';
import schema from '../../../../schema';

interface Props {
    setLoadings(params: SetDashboardLoadingsAction): void;
    setProjectWiseSlotStats(params: SetProjectWiseSlotStatsAction): void;
}

export default class GetProjectWiseSlotsRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (params: ProjectWiseParams): RestRequest => {
        const filters = {
            project: params.project,
            date_gt: params.date ? params.date.startDate : undefined,
            date_lt: params.date ? params.date.endDate : undefined,
        };

        const request = new FgRestBuilder()
            .url(createUrlForProjectWiseSlotStats(filters))
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setLoadings({ projectWiseLoading: true }); })
            .postLoad(() => { this.props.setLoadings({ projectWiseLoading: false }); })
            .success((response: { results: ProjectWiseSlotStat[] }) => {
                try {
                    schema.validate(response, 'projectWiseSlotStatsGetResponse');
                    this.props.setProjectWiseSlotStats({ slotStats: response.results });
                } catch (err) {
                    console.error(err);
                }
            })
            .build();
        return request;

    }
}
