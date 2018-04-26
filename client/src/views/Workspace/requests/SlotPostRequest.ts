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
    urlForSlot,
    createParamsForPostSlot,
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

    success = (response: SlotPostResponse) => {
        try {
            schema.validate(response, 'slotPostResponse');
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

    create = (values: SlotData): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForSlot)
            .params(() => createParamsForPostSlot(values))
            .preLoad(() => { this.props.setState({ pending: true }); })
            .postLoad(() => { this.props.setState({ pending: false }); })
            .success(this.success)
            .failure(this.failure)
            .fatal(this.fatal)
            .build();
        return request;

    }
}
