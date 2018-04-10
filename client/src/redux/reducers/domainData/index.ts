import createReducerWithMap from '../../../utils/createReducerWithMap';

import userReducer from './user';
import userGroupReducer from './userGroup';
import projectReducer from './project';
import slotReducer from './slot';
import taskReducer from './task';
import commonReducer from './common';

import initialDomainData from '../../initial-state/domainData';

const reducers = {
    ...userReducer,
    ...userGroupReducer,
    ...projectReducer,
    ...slotReducer,
    ...taskReducer,
    ...commonReducer,
};

const reducer = createReducerWithMap(reducers, initialDomainData);
export default reducer;
