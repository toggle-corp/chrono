import React from 'react';

import Bundle from '../vendor/react-store/components/General/Bundle';

interface Props {
    load: () => any; // tslint:disable-line no-any
}

export default class ViewManager extends React.PureComponent<Props, {}> {
    componentWillMount() {
        console.log('Mounting ViewManager');
    }

    componentWillUnmount() {
        console.log('Unmounting ViewManager');
    }

    render() {
        const { load, ...otherProps } = this.props;
        return (
            <Bundle
                load={load}
                {...otherProps}
            />
        );
    }
}
