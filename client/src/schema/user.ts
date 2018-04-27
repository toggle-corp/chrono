import { Schema } from './interface';

const userSchema: Schema[] = [
    {
        doc: { name: 'user' },
        fields: {
            id: { type: 'uint', required: 'true' },
            username: { type: 'email', required: 'true' },
            email: { type: 'email', required: 'true' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            displayName: { type: 'string' },
        },
    },
    {
        doc: { name: 'userPostResponse' },
        extends: 'user',
    },
    {
        doc: { name: 'userGetResponse' },
        extends: 'user',
    },
];
export default userSchema;
