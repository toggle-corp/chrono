import createReducerWithMap from '../../utils/createReducerWithMap';

import {
    DomainData,
    ReducerGroup,
} from '../interface';
import initialDominDataState from '../initial-state/domainData';

// ACTION-TYPE


// ACTION-CREATOR

// HELPER

// REDUCER

export const domainDataReducer: ReducerGroup<DomainData> = {};

export default createReducerWithMap(domainDataReducer, initialDominDataState);
