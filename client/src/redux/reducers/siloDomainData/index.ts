import createReducerWithMap from '../../../utils/createReducerWithMap';

import userReducer from './user';
import slotReducer from './slot';
import projectReducer from './project';
import userGroupReducer from './userGroup';
import dashboardReducer from './dashboard';

import { AUTH_ACTION } from '../auth';

import initialSiloDomainData from '../../initial-state/siloDomainData';

const logout = () => initialSiloDomainData;

const reducers = {
    ...userReducer,
    ...slotReducer,
    ...projectReducer,
    ...userGroupReducer,
    ...dashboardReducer,
    [AUTH_ACTION.logout]: logout,
};

const reducer = createReducerWithMap(reducers, initialSiloDomainData);
export default reducer;
