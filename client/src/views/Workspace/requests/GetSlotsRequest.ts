import {
    RestRequest,
    FgRestBuilder,
} from '#rsu/rest';

import { Request } from '../../../rest/interface';
import {
    TimeSlot,
    SetTimeSlotsAction,
} from '../../../redux/interface';
import {
    createUrlForSlotsByYear,
    commonParamsForGet,
} from '../../../rest';
import schema from '../../../schema';

import { Workspace } from '../index';

interface Props {
    setState: Workspace['setState'];
    setTimeSlots(params: SetTimeSlotsAction): void;
}

export default class GetSlotsRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (activeYear: number): RestRequest => {
        const newUrl = createUrlForSlotsByYear({
            date_gt: `${activeYear}-01-01`,
            date_lt: `${activeYear}-12-31`,
        });

        const request = new FgRestBuilder()
            .url(newUrl)
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ pendingSlots: true }); })
            .postLoad(() => { this.props.setState({ pendingSlots: false }); })
            .success((response: { results: TimeSlot[] }) => {
                try {
                    schema.validate(response, 'slotsGetResponse');
                    this.props.setTimeSlots({ timeSlots: response.results });
                } catch (err) {
                    console.error(err);
                }
            })
            .build();
        return request;
    }
}
