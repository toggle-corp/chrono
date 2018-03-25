import React from 'react';

import ListView from '../../vendor/react-store/components/View/List/ListView';

import DayEditor from './DayEditor';
import styles from './styles.scss';

interface OwnProps {}
interface PropsFromState { }
interface PropsFromDispatch { }

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    data: object[];
}

interface Data {
    timestamp: number;
    month: number;
    year: number;
}

export default class Workspace extends React.PureComponent<Props, States> {
    constructor(props: Props) {
        super(props);

        const date = new Date();
        const data: Data[] = [
            {
                timestamp: + date,
                month: date.getMonth(),
                year: date.getFullYear(),
            },
        ];

        this.state = {
            data,
        };
    }

    renderDay = (key: string, date: Data) => {
        return (
            <div key={date.timestamp}>
                {date.year}/{date.month}
            </div>
        );
    }

    render() {
        const { data } = this.state;
        return (
            <div className={styles.workspace}>
                <ListView
                    className={styles.listView}
                    data={data}
                    modifier={this.renderDay}
                />
                <DayEditor />
            </div>
        );
    }
}
