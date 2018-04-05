import { DomainData } from '../interface';

const initialDomainDataState: DomainData = {
    activeDay: '2017-10-10',
    userGroups: [],

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

    timeslotViews: {
        0: { // index is slot id NOTE: 0 is for new
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
};

export default initialDomainDataState;
