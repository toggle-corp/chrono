import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Request } from '../../../rest/interface';
import {  TimeSlot } from '../../../redux/interface';
import { SetTimeSlotsAction } from '../../../redux';
import {
    urlForSlots,
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

    create = (): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForSlots)
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
