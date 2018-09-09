import {
    RestRequest,
    FgRestBuilder,
} from '../../../../../vendor/react-store/utils/rest';
import notify from '../../../../../notify';

import { Request } from '../../../../../rest/interface';
import schema from '../../../../../schema';
import { OverviewParams } from '../../../../../redux/interface';
import {
    createUrlForOverviewExport,
    commonParamsForGet,
} from '../../../../../rest';

import { Filter } from '../index';

interface Props {
    setState: Filter['setState'];
}

export default class ExportRequest implements Request<{}> {
    props: Props;
    schema: string;

    // schema = 'ExportDownloadResponse';

    constructor(props: Props) {
        this.props = props;
    }

    handlePreload = () => {
        this.props.setState({ exportLoading: true });
    }

    handlePostload = () => {
        this.props.setState({ exportLoading: false });
    }

    handleSuccess = (response:any) => {
        try {
            schema.validate(response, 'exportResponse');
            window.open(response.file);
        } catch (err) {
            console.error(err);
        }
    }

    handleFailure = () => {
        notify.send({
            title: 'Export Tasks',
            type: notify.type.ERROR,
            message: 'Failed to export tasks',
            duration: notify.duration.MEDIUM,
        });
    }

    handleFatal = () => {
        notify.send({
            title: 'Export Tasks',
            type: notify.type.ERROR,
            message: 'Failed to export tasks',
            duration: notify.duration.SLOW,
        });
    }

    create = (filters: OverviewParams): RestRequest => {
        const request = new FgRestBuilder()
            .url(createUrlForOverviewExport(filters))
            .params(commonParamsForGet)
            .preLoad(this.handlePreload)
            .postLoad(this.handlePostload)
            .success(this.handleSuccess)
            .fatal(this.handleFatal)
            .failure(this.handleFailure)
            .build();
        return request;
    }
}
