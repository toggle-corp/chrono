import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';
import { getISODate } from '../../../../utils/common';

import { Request } from '../../../../rest/interface';
import {
    DayWiseSlotStat,
    SetDayWiseSlotStatsAction,
    SetDashboardLoadingsAction,
    DayWiseParams,
} from '../../../../redux/interface';
import {
    createUrlForDayWiseSlotStats,
    commonParamsForGet,
} from '../../../../rest';
import schema from '../../../../schema';

interface Props {
    setLoadings(params: SetDashboardLoadingsAction): void;
    setDayWiseSlotStats(params: SetDayWiseSlotStatsAction): void;
}

export default class GetDayWiseSlotsRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (params: DayWiseParams): RestRequest => {
        const filters = {
            user: params.users,
            date_gt: params.date ? getISODate(params.date.startDate) : undefined,
            date_lt: params.date ? getISODate(params.date.endDate) : undefined,
        };

        const request = new FgRestBuilder()
            .url(createUrlForDayWiseSlotStats(filters))
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setLoadings({ dayWiseLoading: true }); })
            .postLoad(() => { this.props.setLoadings({ dayWiseLoading: false }); })
            .success((response: DayWiseSlotStat[]) => {
                try {
                    schema.validate({ results: response }, 'dayWiseSlotStatsGetResponse');
                    this.props.setDayWiseSlotStats({ slotStats: response });
                } catch (err) {
                    console.error(err);
                }
            })
            .build();
        return request;

    }
}
