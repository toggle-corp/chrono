import { compose } from 'redux';
import { connect } from 'react-redux';

import { createRequestCoordinator, methods } from './vendor/react-rest-request/src';
export * from './vendor/react-rest-request/src';

import update from '#rsu/immutable-update';

import { wsEndpoint } from './config/rest';
import schema from './schema';
import { alterResponseErrorToFaramError } from './rest';
import { tokenSelector } from './redux';
import { RootState, Token } from './redux/interface';
import { ErrorsFromServer } from './rest/interface';

const mapStateToProps = (state: RootState) => ({
    myToken: tokenSelector(state),
});

interface Params {
    method: string;
    headers: { [key: string]: string };
    body?: string;
}

interface CoordinatorAttributes {
    key: string;
    group?: string;

    method: string;
    url: string;
    body?: object;
    query?: { [key: string]: string };
    options?: object;
    extras?: object;

    onSuccess?: (value: { response: object, status: number }) => void;
    onFailure?: (value: { error: object, status: number }) => void;
    onFatal?: (value: { error: object }) => void;
}

export const createConnectedRequestCoordinator = <OwnProps>() => {
    interface PropsFromState {
        myToken: Token;
    }

    interface PropsFromDispatch {
    }

    type Props = OwnProps & PropsFromDispatch & PropsFromState;
    type NextProps = Pick<Props, Exclude<keyof OwnProps, 'myToken'>>;

    return compose(
        connect<PropsFromState, PropsFromDispatch, OwnProps>(mapStateToProps),
        createRequestCoordinator<Props, NextProps>({
            transformParams: (params: Params, props: Props) => {
                const { access } = props.myToken;
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
            transformProps: (props: Props) => {
                const {
                    myToken, // eslint-disable-line no-unused-vars
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

            transformResponse: (body: object, request: CoordinatorAttributes) => {
                const {
                    url,
                    method,
                    extras: requestOptions,
                } = request;
                const extras = requestOptions as { schemaName?: string };

                if (!extras || extras.schemaName === undefined) {
                    // NOTE: usually there is no response body for DELETE
                    if (method !== methods.DELETE) {
                        console.error(`Schema is not defined for ${url} ${method}`);
                    }
                } else {
                    try {
                        schema.validate(body, extras.schemaName);
                    } catch (e) {
                        console.error(url, method, body, e.message);
                        throw (e);
                    }
                }
                return body;
            },

            transformErrors: (responseRequest: object) => {
                const response = responseRequest as { errors: ErrorsFromServer };
                const faramErrors = alterResponseErrorToFaramError(response.errors);
                return {
                    response,
                    faramErrors,
                };
            },
        }),
    );
};
