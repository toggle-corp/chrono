import { persistCombineReducers } from 'redux-persist';

// import domainDataReducer from './domainData';
import authReducer from './auth';

import storeConfig from '../../config/store';

const reducers = {
    // domainData: domainDataReducer,
    auth: authReducer,
};

const appReducer = persistCombineReducers(storeConfig, reducers);
export default appReducer;
