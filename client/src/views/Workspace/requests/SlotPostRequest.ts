import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Request } from '../../../rest/interface';
import schema from '../../../schema'; 
import {
    urlForSlot,
    createParamsForPostSlot,
} from '../../../rest';

import { SlotEditor } from '../SlotEditor';

interface Props {
    setState: SlotEditor['setState'];
    // setSlot(params: SlotData): void;
}

interface SlotPostResponse {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    remarks: string;
    task: number;
    user: number;
}

interface SlotData {
    date: string;
    startTime: string;
    endTime: string;
    task: number;
    user: number;
}

export default class SlotPostRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (values: SlotData): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForSlot)
            .params(() => createParamsForPostSlot(values))
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success((response: SlotPostResponse) => {
                try {
                    schema.validate(response, 'slotPostResponse');
                    console.log(response);
                    // this.props.setSlot(response);
                } catch (err) {
                    console.error(err);
                }
            })
            .build();
        return request;
    }
}
