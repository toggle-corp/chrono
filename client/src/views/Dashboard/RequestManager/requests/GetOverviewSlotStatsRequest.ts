import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

import { Request } from '../../../../rest/interface';
import {
    OverviewSlotStat,
    SetOverviewSlotStatsAction,
    SetDashboardLoadingsAction,
    OverviewParams,
} from '../../../../redux/interface';
import {
    createUrlForSlotStats,
    commonParamsForGet,
} from '../../../../rest';
import schema from '../../../../schema';

interface Props {
    setLoadings(params: SetDashboardLoadingsAction): void;
    setOverviewSlotStats(params: SetOverviewSlotStatsAction): void;
}

export default class GetOverviewSlotsRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (params: OverviewParams): RestRequest => {
        const filters = {
            project: params.project,
            user_group: params.userGroup,
            task: params.task,
            user: params.user,
            date_gt: params.date ? params.date.startDate : undefined,
            date_lt: params.date ? params.date.endDate : undefined,
        };

        console.warn(filters);
        const request = new FgRestBuilder()
            .url(createUrlForSlotStats(filters))
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setLoadings({ overviewLoading: true }); })
            .postLoad(() => { this.props.setLoadings({ overviewLoading: false }); })
            .success((response: { results: OverviewSlotStat[] }) => {
                try {
                    schema.validate(response, 'slotStatsGetResponse');
                    this.props.setOverviewSlotStats({ slotStats: response.results });
                } catch (err) {
                    console.error(err);
                }
            })
            .build();
        return request;

    }
}
