import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Request } from '../../../rest/interface';
import {
    createUrlForSlot,
    commonParamsForDelete,
} from '../../../rest';
import notify from '../../../notify';

import { SlotEditor } from '../SlotEditor';

interface Props {
    setState: SlotEditor['setState'];
    deleteTimeSlot(): void;
}

export default class SlotDeleteRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (slotId: number): RestRequest => {
        const request = new FgRestBuilder()
            .url(createUrlForSlot(slotId))
            .params(commonParamsForDelete)
            .preLoad(() => {
                this.props.setState({ pendingDelete: true });
            })
            .postLoad(() => {
                this.props.setState({ pendingDelete: false });
            })
            .success(() => {
                this.props.deleteTimeSlot();
            })
            .failure(() => {
                // FIXME: show error from server
                notify.send({
                    title: 'Timeslot Delete',
                    type: notify.type.ERROR,
                    message: 'Failed when trying to delete the timeslot',
                    duration: notify.duration.SLOW,
                });
            })
            .fatal(() => {
                notify.send({
                    title: 'Timeslot Delete',
                    type: notify.type.ERROR,
                    message: 'Failed when trying to delete the timeslot',
                    duration: notify.duration.SLOW,
                });
            })

            .build();
        return request;
    }
}
