import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { SaveTimeSlotAction } from '../../../redux';
import { WipTimeSlot, TimeSlot } from '../../../redux/interface';
import { Request } from '../../../rest/interface';
import schema from '../../../schema'; 
import {
    urlForSlot,
    createParamsForPostSlot,
} from '../../../rest';

import { SlotEditor } from '../SlotEditor';

interface Props {
    setState: SlotEditor['setState'];
    saveTimeSlot(params: SaveTimeSlotAction): void;
}

type SlotData = WipTimeSlot['faramValues'] & { date: string };

export default class SlotPostRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (values: SlotData): RestRequest => {
        // TODO: handle error while saving
        const request = new FgRestBuilder()
            .url(urlForSlot)
            .params(() => createParamsForPostSlot(values))
            .preLoad(() => { this.props.setState({ pendingSave: true }); })
            .postLoad(() => { this.props.setState({ pendingSave: false }); })
            .success((response: TimeSlot) => {
                try {
                    schema.validate(response, 'slotPostResponse');
                    this.props.saveTimeSlot({
                        timeSlot: response,
                    });
                    console.log(response);
                } catch (err) {
                    console.error(err);
                }
            })
            .build();
        return request;
    }
}
