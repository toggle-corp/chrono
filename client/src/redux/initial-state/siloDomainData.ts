import { SiloDomainData } from '../interface';

const initialState: SiloDomainData = {
    workspace: {
        activeDate: {
            /*
            year: 2018,
            month: 4,
            day: 27,
            */
        },
        activeTimeSlotId: undefined,

        wipTimeSlots: {
            /*
            '2018-04-01': {
                2: {
                    id: 2,
                    tid: 'wip-2',
                    versionId: 2,
                    faramValues: {
                        startTime: '10:00',
                        endTime: '17:30',
                        remarks: 'Cloudy outside',
                        userGroup: 1,
                        project: 1,
                        task: 1,
                    },
                    faramErrors: {},
                    pristine: true,
                    hasError: false,
                    hasServerError: false,
                },
                3: {
                    id: 3,
                    tid: 'wip-3',
                    versionId: 1,
                    faramValues: {
                        startTime: '17:30',
                        endTime: '19:00',
                        remarks: 'All cleared up',
                        userGroup: 1,
                        project: 1,
                        task: 1,
                    },
                    faramErrors: {},
                    pristine: true,
                    hasError: false,
                    hasServerError: false,
                },
            },
            '2018-04-27': {
                0: {
                    id: undefined,
                    tid: 'wip-0',
                    versionId: undefined,
                    faramValues: {
                        startTime: '10:30',
                        endTime: '15:30',
                        userGroup: 1,
                        project: 1,
                        task: 1,
                        remarks: 'Sunny side up.',
                    },
                    faramErrors: {},
                    pristine: true,
                    hasError: false,
                    hasServerError: false,
                },
                4: {
                    id: 4,
                    tid: 'wip-4',
                    versionId: undefined,
                    faramValues: {
                        startTime: '11:30',
                        endTime: '18:30',
                        userGroup: 1,
                        project: 1,
                        task: 1,
                        remarks: 'Sunny side down.',
                    },
                    faramErrors: {},
                    pristine: true,
                    hasError: false,
                    hasServerError: false,
                },
            },
            */
        },
        timeSlots: {
            /*
            '2018-03-01': {
                1: {
                    id: 1,
                    versionId: 1,
                    date: '2018-03-01',
                    startTime: '10:00',
                    endTime: '17:30',
                    user: 1,
                    task: 1,
                    remarks: 'Raining outside.',
                },
            },
            '2018-04-01': {
                2: {
                    id: 2,
                    versionId: 2,
                    date: '2018-04-01',
                    startTime: '10:00',
                    endTime: '17:30',
                    user: 1,
                    task: 1,
                    remarks: 'Cloudy outside',
                },
                3: {
                    id: 3,
                    versionId: 1,
                    date: '2018-04-01',
                    startTime: '17:30',
                    endTime: '19:00',
                    user: 1,
                    task: 1,
                    remarks: 'All cleared up',
                },
            },
            '2018-04-27': {
                4: {
                    id: 4,
                    versionId: 1,
                    date: '2018-04-27',
                    startTime: '10:30',
                    endTime: '15:30',
                    user: 1,
                    task: 1,
                    remarks: 'Sunny side up.',
                },
            },
             */
        },
    },

    slotStats: [],
};

export default initialState;
