import { Schema } from '@togglecorp/ravl';

const projectSchemas: Schema[] = [
    {
        doc: { name: 'project' },
        extends: 'dbentity',
        fields: {
            title: { type: 'string' },
            description: { type: 'string' },
            userGroup: { type: 'uint' },
        },
    },
    {
        doc: { name: 'projectsGetResponse' },
        fields: {
            results: { type: 'array.project', required: true },
            count: { type: 'uint', required: true },
            next: { type: 'string' },
            previous: { type: 'string' },
        },
    },
    {
        doc: { name: 'projectsPostResponse' },
        extends: 'project',
    },
];
export default projectSchemas;
