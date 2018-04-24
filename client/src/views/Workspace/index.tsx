import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import ListView from '../../vendor/react-store/components/View/List/ListView';
import { RestRequest } from '../../vendor/react-store/utils/rest';
import { getNumDaysInMonthX } from '../../vendor/react-store/utils/common';

import {
    setUserGroupsAction,
    setProjectsAction,
    setTasksAction,
} from '../../redux';
import { RootState, UserGroup, Project, Task } from '../../redux/interface';
import SlotEditor from './SlotEditor';
import * as styles from './styles.scss';

import GetUserGroupsRequest from './requests/GetUserGroupsRequest';
import GetProjectsRequest from './requests/GetProjectsRequest';
import GetTasksRequest from './requests/GetTasksRequest';

interface OwnProps {}
interface PropsFromState { }
interface PropsFromDispatch {
    setUserGroups(params: UserGroup[]): void;
    setUserProjects(params: Project[]): void;
    setUserTasks(params: Task[]): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    data: Data[];
    currentYear: number;
    currentMonth: number;
    pending: boolean;
}

interface Data {
    day: number;
    month: number;
    year: number;
    weekDay: number;
}

const DAY = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
];

const MONTH = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

export class Workspace extends React.PureComponent<Props, States> {
    userGroupRequest: RestRequest;
    projectsRequest: RestRequest;
    tasksRequest: RestRequest;

    static keyExtractor = (data: Data) => String(data.day);

    constructor(props: Props) {
        super(props);

        const currentYear = 2018;
        const currentMonth = 0; // starts with 0
        const numberOfDays: number = getNumDaysInMonthX(currentYear, currentMonth);

        const data: Data[] = [];
        for (let i = 1; i <= numberOfDays; i += 1) {
            data.push({
                year: currentYear,
                month: currentMonth,
                day: i,
                weekDay: new Date(currentYear, currentMonth, i).getDay(),
            });
        }

        this.state = {
            data,
            currentYear,
            currentMonth,
            pending: false,
        };
    }

    componentWillMount() {
        this.startRequestForUserGroup();
        this.startRequestForProjects();
        this.startRequestForTasks();
    }

    componentWillUnmount() {
        if (this.userGroupRequest) {
            this.userGroupRequest.stop();
        }
    }

    startRequestForProjects = () => {
        if (this.projectsRequest) {
            this.projectsRequest.stop();
        }
        const request = new GetProjectsRequest({
            setUserProjects: this.props.setUserProjects,
            setState: params => this.setState(params),
        });
        this.projectsRequest = request.create();
        this.projectsRequest.start();
    }

    startRequestForTasks = () => {
        if (this.tasksRequest) {
            this.tasksRequest.stop();
        }
        const request = new GetTasksRequest({
            setUserTasks: this.props.setUserTasks,
            setState: params => this.setState(params),
        });
        this.tasksRequest = request.create();
        this.tasksRequest.start();
    }

    startRequestForUserGroup = () => {
        if (this.userGroupRequest) {
            this.userGroupRequest.stop();
        }
        const request = new GetUserGroupsRequest({
            setUserGroups: this.props.setUserGroups,
            setState: params => this.setState(params),
        });
        this.userGroupRequest = request.create();
        this.userGroupRequest.start();
    }

    renderDay = (key: string, date: Data) => (
        <div
            key={key}
            className={styles.datewrapper}
        >
            {DAY[date.weekDay]} {date.day}
        </div>
    )

    render() {
        const { data } = this.state;
        return (
            <div className={styles.workspace}>
                <div className={styles.datebar}>
                    {this.state.currentYear} {MONTH[this.state.currentMonth]}
                </div>
                <div className={styles.information} >
                    <ListView
                        className={styles.listView}
                        data={data}
                        modifier={this.renderDay}
                    />
                </div>
                <SlotEditor />
                <div className={styles.bottom} >
                    Bottom Part
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setUserGroups: (params: UserGroup[]) => dispatch(setUserGroupsAction(params)),
    setUserProjects: (params: Project[]) => dispatch(setProjectsAction(params)),
    setUserTasks: (params: Task[]) => dispatch(setTasksAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    undefined, mapDispatchToProps,
)(Workspace);
