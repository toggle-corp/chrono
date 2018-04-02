import { SchemaGroup } from './interface';

const userGroupSchema: SchemaGroup = [];

{
    const name = 'userGroup';
    const schema = {
        doc: {
            name: 'User Group',
        },
        fields: {  
            description: { type: 'string' } ,
            id: { type: 'uint' } ,
            memberships: { type: 'array' } , // FIXME: complete this
            role: { type: 'string' } ,
            title: { type: 'string' } ,
        },
    };
    userGroupSchema.push({ name, schema });
}
{
    const name = 'userGroupsResponse';
    const schema = {
        doc: {
            name: 'User Group Response',
        },
        fields: {
            count: { type: 'number', required: 'true' },
            next: { type: 'number' },
            previous: { type: 'number' },
            results: { type: 'array.userGroup' },
        },
    };
    userGroupSchema.push({ name, schema });
}
export default userGroupSchema;
