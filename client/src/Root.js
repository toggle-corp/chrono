import React from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

import store from './store';

import App from './App';

export default class Root extends React.Component {
    constructor(props) {
        super(props);

        this.state = { rehydrated: false };
        this.store = store;

        console.info('React version:', React.version);
    }

    componentWillMount() {
        console.log('Mounting Root');
        const afterRehydrateCallback = () => this.setState({ rehydrated: true });
        persistStore(this.store, undefined, afterRehydrateCallback);
    }

    render() {
        if (!this.state.rehydrated) {
            // NOTE: showing empty div, this lasts for a fraction of a second
            return (
                <div />
            );
        }

        return (
            <Provider store={this.store}>
                <App />
            </Provider>
        );
    }
}
