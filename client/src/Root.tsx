import React from 'react';
import { Provider, Store } from 'react-redux';
import { persistStore } from 'redux-persist';

import { startActionsSync } from '#rsu/redux-sync';
import store from './store';
import App from './App';

interface State {
    rehydrated: boolean;
}

// NOTE: loads redux
export default class Root extends React.Component<object, State> {
    // tslint:disable-next-line no-any
    store: Store<any>;

    constructor(props: object) {
        super(props);

        this.state = { rehydrated: false };
        this.store = store;
    }

    componentWillMount() {
        const afterRehydrateCallback = () => this.setState({ rehydrated: true });
        persistStore(this.store, undefined, afterRehydrateCallback);
        startActionsSync(this.store);
    }

    render() {
        if (!this.state.rehydrated) {
            // NOTE: showing empty div as it lasts for a jiffy
            return (<div />);
        }

        return (
            <Provider store={this.store}>
                <App />
            </Provider>
        );
    }
}
