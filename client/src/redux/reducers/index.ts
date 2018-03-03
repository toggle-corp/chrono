import { persistCombineReducers } from 'redux-persist';

import authReducer from './auth';
import storeConfig from '../../config/store';

const reducers = {
    auth: authReducer,
};
export default persistCombineReducers(storeConfig, reducers);
