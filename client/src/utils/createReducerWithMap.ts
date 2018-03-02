interface Reducer<T> {
    // tslint:disable-next-line no-any
    [key: string]: (state: T, action: object) => T;
}
const createReducerWithMap =
    <T>(reducers: Reducer<T>, initialState: T) =>
    (state = initialState, action: { type: string }): T => {
    const { type } = action;
    const reducer = reducers[type];
    if (!reducer) {
        return state;
    }
    return reducer(state, action);
};
export default createReducerWithMap;
