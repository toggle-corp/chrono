import { compose } from 'redux';
import { connect } from 'react-redux';

import update from '#rsu/immutable-update';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
    createRequestCoordinator,
    createRequestClient,
    RestRequest,
} from '@togglecorp/react-rest-request';
import { tokenSelector } from './redux';
import { wsEndpoint } from './config/rest';

const mapStateToProps = (state: any) => ({
    token: tokenSelector(state),
});

// tslint:disable-next-line variable-name
const CustomRequestCoordinator = createRequestCoordinator({
    transformParams: (params: any, props: any) => {
        const { access } = props.token;
        if (!access) {
            return params;
        }

        const settings = {
            headers: { $auto: {
                Authorization: { $set: `Bearer ${access}` },
            } },
        };

        return update(params, settings);
    },
    transformProps: (props: any) => {
        const {
            token, // eslint-disable-line no-unused-vars
            ...otherProps
        } = props;
        return otherProps;
    },

    transformUrl: (url: string) => {
        if (/^https?:\/\//i.test(url)) {
            return url;
        }

        return `${wsEndpoint}${url}`;
    },
});

// tslint:disable-next-line variable-name
export const RequestCoordinator = compose<any>(
    connect(mapStateToProps),
    CustomRequestCoordinator,
);

// tslint:disable-next-line variable-name
export const RequestClient = createRequestClient();
export const requestMethods = RestRequest.methods;
