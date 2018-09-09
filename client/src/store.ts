import {
    compose,
    createStore,
    applyMiddleware,
    Middleware,
} from 'redux';
import { Store } from 'react-redux';
import {
    composeWithDevTools,
    EnhancerOptions,
} from 'redux-devtools-extension';

import { createActionSyncMiddleware } from '#rsu/redux-sync.js';

import {
    commonHeaderForPost,
    commonHeaderForGet,
    authorizationHeaderForPost,
} from './config/rest';
import { reducersToSync } from './config/store';
import logger from './redux/middlewares/logger';
import taskManager from './redux/middlewares/taskManager';
import reducer from './redux/reducers';

const isTest = process.env.NODE_ENV === 'test';

const prepareStore = () => {
    const actionSyncer: Middleware = createActionSyncMiddleware(reducersToSync);

    // Invoke refresh access token every 10m
    const middleware: Middleware[] = [
        logger,
        actionSyncer,
        taskManager,
    ];

    const enhancerOptions: EnhancerOptions = {};

    // Override compose if development mode and redux extension is installed
    const overrideCompose = process.env.NODE_ENV === 'development';
    const applicableComposer = !overrideCompose
        ? compose
        : composeWithDevTools(enhancerOptions);

    const enhancer = applicableComposer(
        applyMiddleware(...middleware),
    );
    return createStore(reducer, {}, enhancer);
};

// tslint:disable-next-line no-any
const injectHeaders = (store: Store<any>):void => {
    // eslint-disable-next-line global-require
    const { tokenSelector } = require('./redux/selectors/auth');

    let currentAccess: string;
    store.subscribe(() => {
        const token = tokenSelector(store.getState());

        const prevAccess = currentAccess;
        currentAccess = token.access;
        if (prevAccess !== currentAccess) {
            const bearer = currentAccess ? `Bearer ${currentAccess}` : undefined;
            commonHeaderForPost.Authorization = bearer;
            commonHeaderForGet.Authorization = bearer;
            authorizationHeaderForPost.Authorization = bearer;
        }
    });
};

const store = prepareStore();

if (!isTest) {
    injectHeaders(store);
}

export default store;
