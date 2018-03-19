import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Multiplexer from './Multiplexer';

// NOTE: Handles loading of requests (eg: loading user info, etc)
export default class App extends React.PureComponent<object, object> {
    render() {
        return (
            <BrowserRouter>
                <Multiplexer />
            </BrowserRouter>
        );
    }
}
