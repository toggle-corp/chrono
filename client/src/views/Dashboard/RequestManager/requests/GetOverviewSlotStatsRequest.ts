import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';

import { Request } from '../../../../rest/interface';
import {
    OverviewSlotStat,
    SetOverviewSlotStatsAction,
    SetDashboardLoadingsAction,
    OverviewParams,
    FaramDate,
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
        const {
            date: {
                startDate,
                endDate,
            } = {} as FaramDate,
            ...otherParams
        } = params;
        const filters = {
            ...otherParams, // task, user, tag, project
            user_group: params.userGroup,
            date_gt: startDate,
            date_lt: endDate,
        };

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
