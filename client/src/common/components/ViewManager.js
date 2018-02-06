import React from 'react';

import Bundle from '../../public/components/General/Bundle';

export default class ViewManager extends React.PureComponent {
    componentWillMount() {
        console.log('Mounting ViewManager');
    }

    componentWillUnmount() {
        console.log('Unmounting ViewManager');
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
