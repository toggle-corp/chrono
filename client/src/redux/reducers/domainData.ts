import update from '../../vendor/react-store/utils/immutable-update';
import createReducerWithMap from '../../utils/createReducerWithMap';

import { DayData, DomainData, ReducerGroup } from '../interface';
import initialDominDataState from '../initial-state/domainData';

// ACTION-TYPE

export const enum DAY_DATA_ACTION {
    setDay = 'DOMAIN_DATA/SET_DAY',
}

// ACTION-CREATOR

export const setDataAction = (timestamp: number, data: DayData) => ({
    type: DAY_DATA_ACTION.setDay,
    timestamp,
    data,
});

// HELPER

// REDUCER

const setDayData = (state: DomainData, action: { timestamp: number, data: DayData }) => {
    const { data, timestamp } = action;
    const settings = {
        dayData: {
            [timestamp]: { $auto: {
                $set: data,
            } },
        },
    };
    return update(state, settings);
};

export const domainDataReducer: ReducerGroup<DomainData> = {
    [DAY_DATA_ACTION.setDay]: setDayData,
};
export default createReducerWithMap(domainDataReducer, initialDominDataState);
