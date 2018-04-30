import { Schema } from './interface';

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
            userGroup: { type: 'uint', required: true },
            project: { type: 'uint', required: true },
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
];
export default slotSchemas;


