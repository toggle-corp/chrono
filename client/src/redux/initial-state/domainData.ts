import { DomainData } from '../interface';

const initialDomainDataState: DomainData = {

    // SILODOMAIN

    activeDay: '2017-10-10',

    workspace: {
        active: {
            date: '2017-10-10',
            slot: {
                '2017-10-10': 1,  // index is date, value is slot id
            },
        },
        timeslot: {
            '2017-10-10': { // index is date
                1: { // index is slot id
                    id: 1,
                    user: 1,
                    task: 1,
                    startTime: '10:00',
                    endTime: '05:00',
                    date: '2017-10-10',
                    remarks: 'some remark',
                },
            },
        },
    },

    // NOTE: index 0 is for new timeslot
    timeslotViews: {
        0: { // index is slot id
            data: {
                id: 0,
                user: 1,
                task: 1,
                startTime: '10:00',
                endTime: '05:00',
                date: '2017-10-10',
                remarks: 'some remark',
            },
            pristine: false,
            formErrors: {},
            formFieldErrors: {},

        },
    },

    users: {},

    slotData: {
        // index should be day timestamp or FIXME
        startTime: '10:00',
        endTime: '05:00',
        date: '2017-10-10',
        id: 1,
        user: 1,
        task: 1,
        remarks: 'some remark',
    },

    // DOMAIN DATA

    // all user groups
    userGroups: [],

    // all user projects
    projects: [
    ],

    // all user tasks
    tasks: [
    ],
};

export default initialDomainDataState;
