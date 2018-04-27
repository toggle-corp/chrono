import { Schema } from './interface';

const tokenSchemas: Schema[] = [
    {
        doc: {
            name: 'accessToken',
            description: 'Data decoded from access token',
        },
        fields: {
            userId: { type: 'uint', required: 'true' },
            tokenType: { type: 'string', required: 'true' },
            username: { type: 'string', required: 'true' },
            displayName: { type: 'string', required: 'true' },
            exp: { type: 'uint', required: 'true' },
            isSuperuser: { type: 'boolean', required: true },
        },
    },
    {
        doc: {
            name: 'tokenGetResponse',
            description: 'Response for POST /token/',
        },
        fields: {
            access: { type: 'string', required: 'true' },
            refresh: { type: 'string', required: 'true' },
        },
    },
    {
        doc: {
            name: 'tokenRefreshResponse',
            description: 'Response for POST /token/refresh/',
        },
        fields: {
            access: { type: 'string', required: 'true' },
        },
    },
];

export default tokenSchemas;
