import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import FormattedDate from '../../vendor/react-store/components/View/FormattedDate';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import Button from '../../vendor/react-store/components/Action/Button';
import ListView from '../../vendor/react-store/components/View/List/ListView';
import { RestRequest } from '../../vendor/react-store/utils/rest';
import { getNumDaysInMonthX } from '../../vendor/react-store/utils/common';
import { getCanonicalDate } from '../../utils/map';

import {
    setUserGroupsAction,
    setProjectsAction,
    setTasksAction,

    activeTimeSlotIdSelector,
    activeDateSelector,
    activeTimeSlotsSelector,
    setActiveSlotAction,
    setTimeSlotsAction,

    SetActiveSlotAction,
    SetTimeSlotsAction,
} from '../../redux';
import {
    RootState,
    UserGroup,
    Project,
    Task,
    TimeSlots,
    TimeSlot,
} from '../../redux/interface';
import SlotEditor from './SlotEditor';
import * as styles from './styles.scss';

import GetUserGroupsRequest from './requests/GetUserGroupsRequest';
import GetProjectsRequest from './requests/GetProjectsRequest';
import GetSlotsRequest from './requests/GetSlotsRequest';
import GetTasksRequest from './requests/GetTasksRequest';

interface Ymd {
    year: number;
    month: number;
    day?: number;
}

interface OwnProps {}
interface PropsFromState {
    activeDate: Ymd;
    activeTimeSlots: TimeSlots<TimeSlot>;
    activeTimeSlotId?: number;
}
interface PropsFromDispatch {
    setUserGroups(params: UserGroup[]): void;
    setUserProjects(params: Project[]): void;
    setUserTasks(params: Task[]): void;
    setActiveSlot(params: SetActiveSlotAction): void;
    setTimeSlots(param: SetTimeSlotsAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface States {
    listData: ListData[];
    today: {
        year: number;
        month: number;
        day: number;
    };
    pendingProjects: boolean;
    pendingTasks: boolean;
    pendingUsergroups: boolean;
    pendingSlots: boolean;
}

interface ListData {
    year: number;
    month: number;
    day: number;
}

export class Workspace extends React.PureComponent<Props, States> {
    userGroupRequest: RestRequest;
    projectsRequest: RestRequest;
    tasksRequest: RestRequest;
    slotsRequest: RestRequest;

    static keyExtractor = (listData: ListData) => String(listData.day);

    static calculateListData = (activeDate: Ymd) => {
        const { year, month } = activeDate;
        const numberOfDays = getNumDaysInMonthX(year, month);

        const listData: ListData[] = [];
        for (let i = 1; i <= numberOfDays; i += 1) {
            listData.push({
                year,
                month,
                day: i,
            });
        }
        return listData;
    }

    constructor(props: Props) {
        super(props);

        const listData = Workspace.calculateListData(this.props.activeDate);

        const now = new Date();
        const today = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
        };

        this.state = {
            listData,
            today,
            pendingProjects: true,
            pendingTasks: true,
            pendingUsergroups: true,
            pendingSlots: true,
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.activeDate !== nextProps.activeDate) {
            const listData = Workspace.calculateListData(this.props.activeDate);
            this.setState({ listData });
        }
    }

    componentWillMount() {
        this.startRequestForUserGroup();
        this.startRequestForProjects();
        this.startRequestForTasks();
        this.startRequestForSlots();
    }

    componentWillUnmount() {
        if (this.userGroupRequest) {
            this.userGroupRequest.stop();
        }
    }

    startRequestForSlots = () => {
        if (this.slotsRequest) {
            this.slotsRequest.stop();
        }
        const request = new GetSlotsRequest({
            setState: params => this.setState(params),
            setTimeSlots: this.props.setTimeSlots,
        });
        this.slotsRequest = request.create();
        this.slotsRequest.start();
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

    handleSlotClick = (
        year: number, month: number, day: number, timeSlotId: number | undefined,
    ) => () => {
        this.props.setActiveSlot({
            year,
            month,
            day,
            timeSlotId,
        });
    }

    renderTimeSlot = (date: ListData) => (timeSlot: TimeSlot) => {
        const { activeTimeSlotId } = this.props;
        const classNames = [
            styles.button,
        ];
        if (timeSlot.id === activeTimeSlotId) {
            classNames.push(styles.activeSlot);
        }
        return (
            <Button
                key={timeSlot.id}
                className={classNames.join(' ')}
                title={timeSlot.remarks}
                onClick={this.handleSlotClick(date.year, date.month, date.day, timeSlot.id)}
            >
                {timeSlot.startTime} - {timeSlot.endTime}
            </Button>
        );
    }

    renderDay = (key: string, date: ListData) => {
        const classNames = [
            styles.datewrapper,
        ];

        if (this.props.activeDate.day === date.day) {
            classNames.push(styles.active);
        }

        const isToday = (
            date.year === this.state.today.year &&
            date.month === this.state.today.month &&
            date.day === this.state.today.day
        );
        if (isToday) {
            classNames.push(styles.today);
        }

        const {
            activeTimeSlots,
            activeTimeSlotId,
        } = this.props;

        const canonicalDate = getCanonicalDate(date.year, date.month, date.day);
        const timeSlots = activeTimeSlots[canonicalDate];

        const addButtonClassNames = [
            styles.button,
        ];
        if (this.props.activeDate.day === date.day && activeTimeSlotId === undefined) {
            addButtonClassNames.push(styles.activeSlot);
        }

        return (
            <div
                key={key}
                className={classNames.join(' ')}
            >
                <div className={styles.left}>
                    <div className={styles.date}>
                        <FormattedDate
                            date={`${date.year}-${date.month}-${date.day}`}
                            mode="EEE, dd"
                        />
                    </div>
                </div>
                <div className={styles.right}>
                    <Button
                        className={addButtonClassNames.join(' ')}
                        title="Add a new timeslot"
                        onClick={this.handleSlotClick(date.year, date.month, date.day, undefined)}
                    >
                        +
                    </Button>
                    {timeSlots && Object.values(timeSlots).map(this.renderTimeSlot(date))}
                </div>
            </div>
        );
    }

    render() {
        const {
            listData,
            pendingProjects,
            pendingTasks,
            pendingUsergroups,
            pendingSlots,
        } = this.state;
        const {
            activeDate,
        } = this.props;

        if (pendingProjects || pendingTasks || pendingUsergroups || pendingSlots) {
            return (
                <div className={styles.workspace}>
                    <LoadingAnimation />
                </div>
            );
        }
        return (
            <div className={styles.workspace}>
                <div className={styles.datebar}>
                    <span className={styles.date}>
                        <FormattedDate
                            date={`${activeDate.year}-${activeDate.month}-${activeDate.day || 1}`}
                            mode="MMM, yyyy"
                        />
                    </span>
                </div>
                <div className={styles.information}>
                    <ListView
                        data={listData}
                        modifier={this.renderDay}
                        keyExtractor={Workspace.keyExtractor}
                    />
                </div>
                <SlotEditor
                    timeSlotId={this.props.activeTimeSlotId}
                    year={activeDate.year}
                    month={activeDate.month}
                    day={activeDate.day}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    activeDate: activeDateSelector(state),
    activeTimeSlots: activeTimeSlotsSelector(state),
    activeTimeSlotId: activeTimeSlotIdSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setUserGroups: (params: UserGroup[]) => dispatch(setUserGroupsAction(params)),
    setUserProjects: (params: Project[]) => dispatch(setProjectsAction(params)),
    setUserTasks: (params: Task[]) => dispatch(setTasksAction(params)),

    setActiveSlot: (params: SetActiveSlotAction) => dispatch(setActiveSlotAction(params)),
    setTimeSlots: (params: SetTimeSlotsAction) => dispatch(setTimeSlotsAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Workspace);
