export const START_REFRESH = 'refresh/START';
export const STOP_REFRESH = 'refresh/STOP';

export const startRefreshAction = loadCallback => ({
    type: START_REFRESH,
    loadCallback,
});

export const stopRefreshAction = () => ({
    type: STOP_REFRESH,
});


class Refresher {
    constructor(store) {
        this.store = store;
    }

    start = () => {}

    stop = () => {}
}

const refresherMiddleware = (store) => {
    const refresher = new Refresher(store);
    return next => (action) => {
        // store, next, action
        switch (action.type) {
            case START_REFRESH:
                refresher.start(action.loadCallback);
                break;
            case STOP_REFRESH:
                refresher.stop();
                break;
            default:
        }
        return next(action);
    };
};

export default refresherMiddleware;
