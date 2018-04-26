import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import {
    FailureResponseFromServer,
    Request,
} from '../../../rest/interface';
import { SlotEditor } from '../SlotEditor';

import {
    createUrlForSlot,
    commonParamsForGet,
} from '../../../rest';
import {
    SlotData,
} from '../../../redux/interface';
import schema from '../../../schema';

interface Props {
    setState: SlotEditor['setState'];
    setSlot(params: SlotData): void;
    unsetSlot(slotId: number): void;
}

export default class SlotGetRequest implements Request<number> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: SlotData) => {
        try {
            schema.validate(response, 'slotGetResponse');
            this.props.setSlot(response);
        } catch (err) {
            console.error(err);
        }
    }

    failure = (slotId: number) => (response: FailureResponseFromServer) => {
        // TODO: notify user
        console.warn('FAILURE', response);
        if (response.errorCode === 404) {
            this.props.unsetSlot(slotId);
        }
    }

    fatal = (response: object) => {
        // TODO: notify user
        console.warn('FATAL', response);
    }

    create = (slotId: number): RestRequest => {
        const request = new FgRestBuilder()
            .url(createUrlForSlot(slotId))
            .params(commonParamsForGet)
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure(slotId))
            .fatal(this.fatal)
            .build();
        return request;
    }
}
