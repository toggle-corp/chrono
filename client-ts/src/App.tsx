import * as React from 'react';
import * as styles from './styles.scss';

class App extends React.Component {
    render() {
        return (
            <div className={styles.app}>
            <header className={styles.appHeader}>
            <h1 className={styles.appTitle}>
                Welcome to React
            </h1>
            </header>
            <p className={styles.appIntro}>
                To get started, edit <code>src/App.tsx</code> and save to reload.
            </p>
            </div>
        );
    }
}

export default App;
