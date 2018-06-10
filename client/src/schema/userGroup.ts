import { Schema } from './interface';

const userGroupSchema: Schema[] = [
    {
        doc: { name: 'member' },
        fields: {
            id: { type: 'uint' },
            member: { type: 'uint' },
            memberName: { type: 'string' },
            memberEmail: { type: 'string' },
            group: { type: 'uint' },
            role: { type: 'string' },
            joinedAt: { type: 'string' },
        },
    },
    {
        doc: { name: 'userGroup' },
        fields: {
            description: { type: 'string' },
            id: { type: 'uint' },
            memberships: { type: 'array.member' },
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
    {
        doc: { name: 'groupMembershipPostResponse' },
        extends: 'member',
    },
];
export default userGroupSchema;
