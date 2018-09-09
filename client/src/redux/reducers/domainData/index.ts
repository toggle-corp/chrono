import createReducerWithMap from '../../../utils/createReducerWithMap';

import userReducer from './user';
import userGroupReducer from './userGroup';
import projectReducer from './project';
import taskReducer from './task';
import tagReducer from './tag';

import { AUTH_ACTION } from '../auth';

import initialDomainData from '../../initial-state/domainData';

const logout = () => initialDomainData;

const reducers = {
    ...userReducer,
    ...userGroupReducer,
    ...projectReducer,
    ...taskReducer,
    ...tagReducer,
    [AUTH_ACTION.logout]: logout,
};

const reducer = createReducerWithMap(reducers, initialDomainData);
export default reducer;
