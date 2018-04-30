import createReducerWithMap from '../../../utils/createReducerWithMap';

import userReducer from './user';
import userGroupReducer from './userGroup';
import projectReducer from './project';
import taskReducer from './task';

import initialDomainData from '../../initial-state/domainData';

const reducers = {
    ...userReducer,
    ...userGroupReducer,
    ...projectReducer,
    ...taskReducer,
};

const reducer = createReducerWithMap(reducers, initialDomainData);
export default reducer;
