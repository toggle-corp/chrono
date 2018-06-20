import createReducerWithMap from '../../../utils/createReducerWithMap';

import userReducer from './user';
import slotReducer from './slot';
import projectReducer from './project';
import userGroupReducer from './userGroup';

import initialSiloDomainData from '../../initial-state/siloDomainData';

const reducers = {
    ...userReducer,
    ...slotReducer,
    ...projectReducer,
    ...userGroupReducer,
};

const reducer = createReducerWithMap(reducers, initialSiloDomainData);
export default reducer;
