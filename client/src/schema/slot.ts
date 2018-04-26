import { SchemaGroup } from './interface';

const slotSchema: SchemaGroup = [];

{
    const name = 'slot';
    const schema = {
        doc: {
            name: 'User Create',
        },
        fields: {
            id: { type: 'uint', required: 'true' },
            date: { type: 'string' },
            endTime: { type: 'string' },
            startTime: { type: 'string' },
            remarks: { type: 'string' },
            task: { type: 'uint' },
        },
    };
    slotSchema.push({ name, schema });
}
{
    const name = 'slotPostResponse';
    const schema = {
        doc: {
            name: 'Slot Create',
        },
        extends: 'slot',
    };
    slotSchema.push({ name, schema });
}
{
    const name = 'slotGetResponse';
    const schema = {
        doc: {
            name: 'Slot Get Reponse',
        },
        extends: 'slot',
    };
    slotSchema.push({ name, schema });
}
{
    const name = 'slotPatchResponse';
    const schema = {
        doc: {
            name: 'Slot Patch Reponse',
        },
        extends: 'slot',
    };
    slotSchema.push({ name, schema });
}

export default slotSchema;
