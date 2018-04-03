import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { ErrorsFromServer } from '../../../rest/interface';
import { SlotEditor } from '../SlotEditor';

import {
    urlForSlot,
    createParamsForPostSlot
} from '../../../rest';
import { SlotData } from '../../../redux/interface';
import schema from '../../../schema'; 

// FIXME: reuse this interface
interface Request<T> {
    create: (value: T) => RestRequest;
}

interface Props {
    setState: SlotEditor['setState'];
    setSlot(params: SlotData): void;
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
                    this.props.setSlot(response);
                } catch (err) {
                    console.error(err);
                }
            })
            .failure((response: { errors: ErrorsFromServer }) => {
                // FIXME: notify user
                console.warn('Failure: ', response);
            })
            .fatal((response: object) => {
                // FIXME: notify user
                console.warn('Fatal: ', response);
            })
            .build();
        return request;

    }
}
