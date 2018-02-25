import { compose, createStore, applyMiddleware } from 'redux';
import { commonHeaderForPost, authorizationHeaderForPost } from './config/rest';

import reducer from './redux/reducers';

// Invoke refresh access token every 10m
const middleware = [];

// Get compose from Redux Devtools Extension
// eslint-disable-next-line no-underscore-dangle
const reduxExtensionCompose = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

// Override compose if development mode and redux extension is installed
const overrideCompose = process.env.NODE_ENV === 'development' && reduxExtensionCompose;
const applicableComposer = !overrideCompose
    ? compose
    : reduxExtensionCompose({ /* specify extention's options here */ });

const enhancer = applicableComposer(
    applyMiddleware(...middleware),
);

// NOTE: replace undefined with an initialState if required
const store = createStore(reducer, undefined, enhancer);

if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line global-require
    const tokenSelector = require('./redux/selectors/auth').tokenSelector;

    let currentAccess;
    store.subscribe(() => {
        const prevAccess = currentAccess;
        const token = tokenSelector(store.getState());
        currentAccess = token.access;
        if (prevAccess !== currentAccess) {
            if (currentAccess) {
                commonHeaderForPost.Authorization = `Bearer ${currentAccess}`;
                authorizationHeaderForPost.Authorization = `Bearer ${currentAccess}`;
            } else {
                commonHeaderForPost.Authorization = undefined;
                authorizationHeaderForPost.Authorization = undefined;
            }
        }
    });
}

export default store;
