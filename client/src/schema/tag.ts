import { Schema } from '@togglecorp/ravl';

const taskSchemas: Schema[] = [
    {
        doc: { name: 'tag' },
        extends: 'dbentity',
        fields: {
            title: { type: 'string', required: true },
            description: { type: 'string' },
            project: { type: 'number', required: true },
            tags: { type: 'array.number' },
        },
    },
    {
        doc: { name: 'tagsGetResponse' },
        fields: {
            results: { type: 'array.tag', required: true },
            count: { type: 'uint', required: true },
            next: { type: 'string' },
            previous: { type: 'string' },
        },
    },
    {
        doc: { name: 'tagPostResponse' },
        extends: 'tag',
    },
];
export default taskSchemas;
