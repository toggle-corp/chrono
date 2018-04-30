import { Schema } from './interface';

const userGroupSchema: Schema[] = [
    {
        doc: { name: 'userGroup' },
        fields: {
            description: { type: 'string' },
            id: { type: 'uint' },
            memberships: { type: 'array' }, // TODO: complete this
            role: { type: 'string' },
            title: { type: 'string' },
        },
    },
    {
        doc: { name: 'userGroupsResponse' },
        fields: {
            count: { type: 'number', required: 'true' },
            next: { type: 'number' },
            previous: { type: 'number' },
            results: { type: 'array.userGroup' },
        },
    },
    {
        doc: { name: 'userGroupPostResponse' },
        extends: 'userGroup',
    },
];
export default userGroupSchema;
