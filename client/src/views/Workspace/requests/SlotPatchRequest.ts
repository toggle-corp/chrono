import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import {
    ErrorsFromServer,
    Request,
    FormFieldErrors,
    FormErrors,
} from '../../../rest/interface';
import { SlotEditor } from '../SlotEditor';

import {
    createUrlForSlot,
    createParamsForPatchSlot,
    transformResponseErrorToFormError,
} from '../../../rest';
import {
    SlotData,
} from '../../../redux/interface';
import schema from '../../../schema';

interface Props {
    setState: SlotEditor['setState'];
    setSlot(params: SlotData): void;
    handleFormError(formFieldErrors: FormFieldErrors, formErrors: FormErrors): void;
}

export default class SlotPatchRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: SlotData) => {
        try {
            schema.validate(response, 'slotPatchResponse');
            this.props.setSlot(response);
        } catch (err) {
            console.error(err);
        }
    }

    failure = (response: { errors: ErrorsFromServer }) => {
        const {
            formFieldErrors, formErrors,
        } = transformResponseErrorToFormError(response.errors);
        this.props.handleFormError(formFieldErrors, formErrors);
    }

    fatal = () => {
        this.props.handleFormError({}, { errors: ['Some error occured.'] });
    }

    create = ({ slotId, values  }: { slotId: number, values: SlotData }): RestRequest => {
        const request = new FgRestBuilder()
            .url(createUrlForSlot(slotId))
            .params(() => createParamsForPatchSlot(values))
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;

    }
}
