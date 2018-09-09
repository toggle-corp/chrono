import { Schema } from '@togglecorp/ravl';

const taskSchemas: Schema[] = [
    {
        doc: { name: 'task' },
        extends: 'dbentity',
        fields: {
            title: { type: 'string', required: true },
            description: { type: 'string' },
            project: { type: 'number' },
        },
    },
    {
        doc: { name: 'tasksGetResponse' },
        fields: {
            results: { type: 'array.task', required: true },
            count: { type: 'uint', required: true },
            next: { type: 'string' },
            previous: { type: 'string' },
        },
    },
    {
        doc: { name: 'tasksPostResponse' },
        extends: 'task',
    },
];
export default taskSchemas;
