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
                <div className={styles.datebar}>
                    <ListView
                        className={styles.listView}
                        data={data}
                        modifier={this.renderDay}
                    />
                </div>
                <div className={styles.information} >
                    <div className={styles.datewrapper}>
                        01, Wednesday
                    </div>
                    <div className={styles.datewrapper}>
                        02, Thursday
                    </div>
                </div>
                <DayEditor />
                <div className={styles.bottom} >
                    Bottom Part
                </div>
            </div>
        );
    }
}
