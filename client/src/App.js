import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Multiplexer from './Multiplexer';

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);

        console.log(props);
    }

    render() {
        return (
            <BrowserRouter>
                <Multiplexer />
            </BrowserRouter>
        );
    }
}
