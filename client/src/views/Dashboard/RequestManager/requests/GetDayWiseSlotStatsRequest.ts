import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

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
            date_gt: params.date ? params.date.startDate : undefined,
            date_lt: params.date ? params.date.endDate : undefined,
        };

        console.warn(filters);
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
