import React from 'react';

import Bundle from '../../public/components/General/Bundle';

export default class ViewManager extends React.PureComponent {
    componentWillMount() {
        console.log('Mounting ProjectRouteSynchronizer');
    }

    componentWillUnmount() {
        console.log('Unmounting ProjectRouteSynchronizer');
    }
    render() {
        const {
            ...otherProps
        } = this.props;

        return (
            <Bundle {...otherProps} />
        );
    }
}
