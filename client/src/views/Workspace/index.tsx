import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import Button from '../../vendor/react-store/components/Action/Button';
import SelectInput from '../../vendor/react-store/components/Input/SelectInput';
import FormattedDate from '../../vendor/react-store/components/View/FormattedDate';
import ListView from '../../vendor/react-store/components/View/List/ListView';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import { getNumDaysInMonthX } from '../../vendor/react-store/utils/common';
import { RestRequest } from '../../vendor/react-store/utils/rest';

import { getCanonicalDate } from '../../utils/map';
import { iconNames } from '../../constants';

import {
    setUserGroupsAction,
    setProjectsAction,
    setTasksAction,
    setTagsAction,

    activeTimeSlotIdSelector,
    activeDateSelector,
    activeTimeSlotsSelector,
    setActiveSlotAction,
    setTimeSlotsAction,
} from '../../redux';
import {
    RootState,
    UserGroup,
    Project,
    Task,
    Tag,
    TimeSlots,
    TimeSlot,
    SetActiveSlotAction,
    SetTimeSlotsAction,
} from '../../redux/interface';
import SlotEditor from './SlotEditor';
import * as styles from './styles.scss';

import GetUserGroupsRequest from './requests/GetUserGroupsRequest';
import GetProjectsRequest from './requests/GetProjectsRequest';
import GetSlotsRequest from './requests/GetSlotsRequest';
import GetTasksRequest from './requests/GetTasksRequest';
import GetTagsRequest from './requests/GetTagsRequest';

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
    setUserTags(params: Tag[]): void;
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
    pendingTags: boolean;
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
    tagsRequest: RestRequest;
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
            pendingTags: true,
            pendingUsergroups: true,
            pendingSlots: true,
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.activeDate !== nextProps.activeDate) {
            const listData = Workspace.calculateListData(nextProps.activeDate);
            this.setState({ listData });
        }
    }

    componentWillMount() {
        this.startRequestForUserGroup();
        this.startRequestForProjects();
        this.startRequestForTasks();
        this.startRequestForTags();
        this.startRequestForSlots();
    }

    componentWillUnmount() {
        if (this.userGroupRequest) {
            this.userGroupRequest.stop();
        }
        if (this.projectsRequest) {
            this.projectsRequest.stop();
        }
        if (this.tasksRequest) {
            this.tasksRequest.stop();
        }
        if (this.tagsRequest) {
            this.tagsRequest.stop();
        }
        if (this.slotsRequest) {
            this.slotsRequest.stop();
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

    startRequestForTags = () => {
        if (this.tagsRequest) {
            this.tagsRequest.stop();
        }
        const request = new GetTagsRequest({
            setUserTags: this.props.setUserTags,
            setState: params => this.setState(params),
        });
        this.tagsRequest = request.create();
        this.tagsRequest.start();
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
        year: number,
        month: number,
        day: number,
        timeSlotId?: number,
    ) => () => {
        this.props.setActiveSlot({
            year,
            month,
            day,
            timeSlotId,
        });
    }

    handleNextMonth = () => {
        let {
            month,
            year,
        } = this.props.activeDate;

        month += 1;
        if (month > 12) {
            month = 1;
            year += 1;
        }

        this.props.setActiveSlot({
            year,
            month,
            day: 1,
        });
    }

    handlePrevMonth = () => {
        let {
            month,
            year,
        } = this.props.activeDate;

        month -= 1;
        if (month < 1) {
            month = 1;
            year -= 1;
        }

        this.props.setActiveSlot({
            year,
            month,
            day: 1,
        });
    }

    handleCurrentMonth = () => {
        this.props.setActiveSlot({
            year: this.state.today.year,
            month: this.state.today.month,
            day: this.state.today.day,
        });
    }

    handleYearChange = (year: number) => {
        this.props.setActiveSlot({
            year,
            month: this.props.activeDate.month,
            day: 1,
        });
    }

    handleMonthChange = (month: number) => {
        this.props.setActiveSlot({
            month,
            year:  this.props.activeDate.year,
            day: 1,
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
        // FIXME: sort timeslots according to started time

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
                            value={`${date.year}-${date.month}-${date.day}`}
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
            pendingTags,
            pendingUsergroups,
            pendingSlots,
            today,
        } = this.state;
        const {
            activeDate,
        } = this.props;

        if (pendingProjects || pendingTasks || pendingTags || pendingUsergroups || pendingSlots) {
            return (
                <div className={styles.workspace}>
                    <LoadingAnimation />
                </div>
            );
        }

        const currentButtonDisabled = (
            today.year === activeDate.year && today.month === activeDate.month
        );
        return (
            <div className={styles.workspace}>
                <div className={styles.datebar}>
                    <div className={styles.date}>
                        <Button
                            onClick={this.handlePrevMonth}
                            iconName={iconNames.prev}
                            title="Previous"
                            transparent
                        />
                        <Button
                            onClick={this.handleNextMonth}
                            iconName={iconNames.next}
                            title="Next"
                            transparent
                        />
                        <Button
                            onClick={this.handleCurrentMonth}
                            iconName={iconNames.circle}
                            title="Current"
                            disabled={currentButtonDisabled}
                            transparent
                        />
                        <SelectInput
                            className={styles.year}
                            label="Year"
                            options={[
                                { key: 2017, label: '2017' },
                                { key: 2018, label: '2018' },
                                { key: 2019, label: '2019' },
                            ]}
                            value={activeDate.year}
                            placeholder="Select year"
                            showHintAndError={false}
                            hideClearButton
                            onChange={this.handleYearChange}
                        />
                        <SelectInput
                            className={styles.month}
                            label="Month"
                            options={[
                                { key: 1, label: 'Jan' },
                                { key: 2, label: 'Feb' },
                                { key: 3, label: 'Mar' },
                                { key: 4, label: 'Apr' },
                                { key: 5, label: 'May' },
                                { key: 6, label: 'Jun' },
                                { key: 7, label: 'Jul' },
                                { key: 8, label: 'Aug' },
                                { key: 9, label: 'Sep' },
                                { key: 10, label: 'Oct' },
                                { key: 11, label: 'Nov' },
                                { key: 12, label: 'Dec' },
                            ]}
                            value={activeDate.month}
                            placeholder="Select month"
                            showHintAndError={false}
                            hideClearButton
                            onChange={this.handleMonthChange}
                        />
                    </div>
                </div>
                <div className={styles.information}>
                    <ListView
                        className={styles.listView}
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
    setUserTags: (params: Tag[]) => dispatch(setTagsAction(params)),

    setActiveSlot: (params: SetActiveSlotAction) => dispatch(setActiveSlotAction(params)),
    setTimeSlots: (params: SetTimeSlotsAction) => dispatch(setTimeSlotsAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Workspace);
