import { Schema } from './interface';

const userSchema: Schema[] = [
    {
        doc: { name: 'user' },
        fields: {
            id: { type: 'uint', required: 'true' },
            username: { type: 'string', required: 'true' },
            email: { type: 'email', required: 'true' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            displayName: { type: 'string' },
        },
    },
    {
        doc: { name: 'userGetRequest' },
        extends: 'user',
    },
    {
        doc: { name: 'userPostResponse' },
        extends: 'user',
    },
    {
        doc: { name: 'usersGetResponse' },
        fields: {
            count: { type: 'uint', required: true },
            next: { type: 'string' },
            previous: { type: 'string' },
            results: { type: 'array.user', required: true },
        },
    },
];
export default userSchema;
