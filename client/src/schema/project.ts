import { SchemaGroup } from './interface';

const projectSchema: SchemaGroup = [];

{
    const name = 'project';
    const schema = {
        doc: {
            name: 'Project Object',
        },
        fields: {
            id: { type: 'uint', required: true },
            createdAt: { type: 'string' },
            modifiedAt: { type: 'string' },
            createdBy: { type: 'uint' },
            modifiedBy: { type: 'uint' },
            createdByName: { type: 'string' },
            modifiedByName: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            userGroup: { type: 'uint' },
        },
    };
    projectSchema.push({ name, schema });
}

{
    const name = 'projectsGetResponse';
    const schema = {
        doc: {
            name: 'Projects',
        },
        fields: {
            results: { type: 'array.project', required: true },
            count: { type: 'uint', required: true },
            next: { type: 'string' },
            previous: { type: 'string' },
        },
    };
    projectSchema.push({ name, schema });
}
{
    const name = 'projectsPostResponse';
    const schema = {
        doc: {
            name: 'Projects',
        },
        extend: 'project',
    };
    projectSchema.push({ name, schema });
}

export default projectSchema;
