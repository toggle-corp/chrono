import { persistCombineReducers } from 'redux-persist';

import authReducer from './auth';
import domainDataReducer from './domainData';
import siloDomainDataReducer from './siloDomainData';
import notifyReducer from './notify';
import routeReducer from './route';
import storeConfig from '../../config/store';

const reducers = {
    auth: authReducer,
    domainData: domainDataReducer,
    notify: notifyReducer,
    route: routeReducer,
    siloDomainData: siloDomainDataReducer,
};

export default persistCombineReducers(storeConfig, reducers);
