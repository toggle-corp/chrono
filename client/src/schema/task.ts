import { SchemaGroup } from './interface';

const taskSchema: SchemaGroup = [];

{
    const name = 'task';
    const schema = {
        doc: {
            name: 'Task object',
        },
        fields: {
            id: { type: 'uint', required: true },
            createdAt: { type: 'string' },
            modifiedAt: { type: 'string' },
            createdBy: { type: 'uint' },
            modifiedBy: { type: 'uint' },
            createdByName: { type: 'string' },
            modifiedByName: { type: 'string' },
            title: { type: 'string', required: true },
            description: { type: 'string' },
            project: { type: 'number' },
            
        },
    };
    taskSchema.push({ name, schema });
}

{
    const name = 'tasksGetResponse';
    const schema = {
        doc: {
            name: 'Get response for tasks',
        },
        fields: {
            results: { type: 'array.task', required: true },
            count: { type: 'uint', required: true },
            next: { type: 'string' },
            previous: { type: 'string' },
        },
    };
    taskSchema.push({ name, schema });
}

export default taskSchema;
