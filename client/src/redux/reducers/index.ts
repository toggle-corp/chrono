import { persistCombineReducers } from 'redux-persist';

import authReducer from './auth';
import domainDataReducer from './domainData';
import userReducer from './user';
import userGroupReducer from './userGroup';
import projectReducer from './project';
import slotReducer from './slot';
import taskReducer from './task';
import notifyReducer from './notify';
import routeReducer from './route';

import storeConfig from '../../config/store';

const reducers = {
    auth: authReducer,
    domainData: domainDataReducer,
    user: userReducer,
    userGroup: userGroupReducer,
    project: projectReducer,
    slot: slotReducer,
    task: taskReducer,
    notify: notifyReducer,
    route: routeReducer,
};
export default persistCombineReducers(storeConfig, reducers);
