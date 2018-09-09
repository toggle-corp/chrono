import { Schema } from '@togglecorp/ravl';

const commonSchemas: Schema[] = [
    {
        doc: { name: 'dbentity' },
        fields: {
            createdAt: { type: 'string', required: true }, // date
            createdBy: { type: 'uint' },
            createdByName: { type: 'string' },
            id: { type: 'uint', required: true },
            modifiedAt: { type: 'string', required: true }, // date
            modifiedBy: { type: 'uint' },
            modifiedByName: { type: 'string' },
            versionId: { type: 'uint' }, // Fixme: should be required
        },
    },
    {
        doc: { name: 'keyValuePair' },
        fields: {
            key: { type: 'uint', required: true },
            value: { type: 'string', required: true },
        },
    },
    {
        doc: {
            name: 'keyValuePairSS',
            description: 'Defines key value pair where key and value both are strings',
        },
        fields: {
            key: { type: 'string', required: true },
            value: { type: 'string', required: true },
        },
    },
];

export default commonSchemas;
