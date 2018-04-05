import { SchemaGroup } from './interface';

const taskSchema: SchemaGroup = [];

{
    const name = 'tasksResponse';
    const schema = {
        doc: {
            name: 'Tasks',
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
            project: { type: 'number' },
            
        },
    };
    taskSchema.push({ name, schema });
}

export default taskSchema;
