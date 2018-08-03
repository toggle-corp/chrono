import { Schema } from '@togglecorp/ravl';

const slotSchemas: Schema[] = [
    {
        doc: { name: 'slot' },
        // extends: 'dbentity',
        fields: {
            id: { type: 'uint', required: true },
            date: { type: 'string', required: true },
            startTime: { type: 'string', required: true },
            endTime: { type: 'string', required: true },
            remarks: { type: 'string' },
            task: { type: 'uint', required: true },
            tags: { type: 'array.uint', required: true } ,
            userGroup: { type: 'uint', required: true },
            project: { type: 'uint', required: true },
        },
    },
    {
        doc: { name: 'slotStat' },
        // extends: 'dbentity',
        fields: {
            id: { type: 'uint', required: true },
            userGroup: { type: 'uint', required: true },
            project: { type: 'uint', required: true },
            task: { type: 'uint', required: true },
            user: { type: 'uint', required: true },
            userGroupDisplayName: { type: 'string' },
            projectDisplayName: { type: 'string' },
            userDisplayName: { type: 'string' },
            taskDisplayName: { type: 'string' },
            taskDescription: { type: 'string' },
            date: { type: 'string' },
            startTime: { type: 'string' },
            endTime: { type: 'string' },
            totalTime: { type: 'string' },
            totalTimeInSeconds: { type: 'number' },
            remarks: { type: 'string' },
        },
    },
    {
        doc: { name: 'projectWiseSlotStat' },
        // extends: 'dbentity',
        fields: {
            // NOTE: id is userId
            id: { type: 'uint', required: true },
            userDisplayName: { type: 'string' },
            project: { type: 'uint', required: true },
            projectTitle: { type: 'string' },
            totalTasks: { type: 'number' },
            totalTime: { type: 'string' },
            totalTimeInSeconds: { type: 'number' },
        },
    },
    {
        doc: { name: 'dayWiseUser' },
        // extends: 'dbentity',
        fields: {
            // NOTE: id is userId
            id: { type: 'uint', required: true },
            totalTime: { type: 'string' },
            totalTimeInSeconds: { type: 'number' },
        },
    },
    {
        doc: { name: 'dayWiseSlotStat' },
        // extends: 'dbentity',
        fields: {
            // NOTE: id is userId
            date: { type: 'string', required: true },
            users: { type: 'array.dayWiseUser', required: true },
        },
    },

    {
        doc: { name: 'slotsGetResponse' },
        fields: {
            results: { type: 'array.slot', required: true },
            count: { type: 'uint', required: true },
            next: { type: 'string' },
            previous: { type: 'string' },
        },
    },
    {
        doc: { name: 'slotPostResponse' },
        extends: 'slot',
    },
    {
        doc: { name: 'slotStatsGetResponse' },
        fields: {
            results: { type: 'array.slotStat', required: true },
            count: { type: 'uint', required: true },
            next: { type: 'string' },
            previous: { type: 'string' },
        },
    },
    {
        doc: { name: 'projectWiseSlotStatsGetResponse' },
        fields: {
            results: { type: 'array.projectWiseSlotStat', required: true },
            count: { type: 'uint', required: true },
            next: { type: 'string' },
            previous: { type: 'string' },
        },
    },
    {
        doc: { name: 'dayWiseSlotStatsGetResponse' },
        fields: {
            results: { type: 'array.dayWiseSlotStat', required: true },
            /*
            count: { type: 'uint', required: true },
            next: { type: 'string' },
            previous: { type: 'string' },
             */
        },
    },
];
export default slotSchemas;
