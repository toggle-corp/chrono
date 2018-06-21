import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import {
    Request,
    SlotStatsUrlParams,
} from '../../../rest/interface';
import {
    SlotStat,
    SetSlotStatsAction,
} from '../../../redux/interface';
import {
    createUrlForSlotStats,
    commonParamsForGet,
} from '../../../rest';
import schema from '../../../schema';

import { Dashboard } from '../index';

interface Props {
    setState: Dashboard['setState'];
    setTimeSlotStats(params: SetSlotStatsAction): void;
}

export default class GetSlotsRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (params: SlotStatsUrlParams): RestRequest => {
        const request = new FgRestBuilder()
            .url(createUrlForSlotStats(params))
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ loading: true }); })
            .postLoad(() => { this.props.setState({ loading: false }); })
            .success((response: { results: SlotStat[] }) => {
                try {
                    schema.validate(response, 'slotStatsGetResponse');
                    this.props.setTimeSlotStats({ slotStats: response.results });
                } catch (err) {
                    console.error(err);
                }
            })
            .build();
        return request;

    }
}
