import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './app.scss';


@CSSModules(styles, { allowMultiple: true })
export default class App extends React.PureComponent {
    render() {
        return (
            <div styleName="app">
                Avada Kedabra !
            </div>
        );
    }
}
