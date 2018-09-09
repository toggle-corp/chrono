import { Schema } from '@togglecorp/ravl';

const taskSchemas: Schema[] = [
    {
        doc: { name: 'task' },
        extends: 'dbentity',
        fields: {
            title: { type: 'string', required: true },
            description: { type: 'string' },
            project: { type: 'number', required: true },
            userGroup: { type: 'number', required: true },
            tags: { type: 'array.number' },
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
    {
        doc: { name: 'exportResponse' },
        fields: {
            id: { type: 'uint', required: true },
            exportedAt: { type: 'string', required: true },
            exportedBy: { type: 'uint', required: true },
            file: { type: 'string', required: true },
            format: { type: 'string', required: true },
            isPreview: { type: 'boolean', required: true },
            mimeType: { type: 'string', required: true },
            pending: { type: 'boolean', required: true },
            title: { type: 'string', required: true },
        },
    },
];
export default taskSchemas;
