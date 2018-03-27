import { persistCombineReducers } from 'redux-persist';

import authReducer from './auth';
import domainDataReducer from './domainData';
import storeConfig from '../../config/store';

const reducers = {
    auth: authReducer,
    domainData: domainDataReducer,
};
export default persistCombineReducers(storeConfig, reducers);
