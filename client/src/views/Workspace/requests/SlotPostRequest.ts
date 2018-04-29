import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { SaveTimeSlotAction, ChangeTimeSlotAction } from '../../../redux';
import { WipTimeSlot, TimeSlot } from '../../../redux/interface';
import { Request, ErrorsFromServer } from '../../../rest/interface';
import schema from '../../../schema';
import {
    urlForSlot,
    createParamsForPostSlot,
    alterResponseErrorToFaramError,
} from '../../../rest';

import { SlotEditor } from '../SlotEditor';

interface Props {
    setState: SlotEditor['setState'];
    saveTimeSlot(params: SaveTimeSlotAction): void;
    changeTimeSlot(params: ChangeTimeSlotAction): void;
}

type SlotData = WipTimeSlot['faramValues'] & { date: string };

export default class SlotPostRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (values: SlotData): RestRequest => {
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
            .failure((response: ErrorsFromServer) => {
                const faramErrors = alterResponseErrorToFaramError(response);
                this.props.changeTimeSlot({ faramErrors });
            })
            .fatal(() => {
                const faramErrors = { $internal: ['Some error occured.'] };
                this.props.changeTimeSlot({ faramErrors });
            })
            .build();
        return request;
    }
}
