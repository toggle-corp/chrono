import { SchemaGroup } from './interface';

const projectSchema: SchemaGroup = [];

{
    const name = 'projectsResponse';
    const schema = {
        doc: {
            name: 'Projects',
        },
        fields: {
            id: { type: 'uint' },
            createdAt: { type: 'string' },
            modifiedAt: { type: 'string' },
            createdBy: { type: 'uint' },
            modifiedBy: { type: 'uint' },
            createdByName: { type: 'string' },
            modifiedByName: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            userGroup: { type: 'string' },
            
        },
    };
    projectSchema.push({ name, schema });
}

export default projectSchema;
