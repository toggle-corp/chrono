import Dict, { basicTypes, Schema } from '@togglecorp/ravl';

import common from './common';
import project from './project';
import task from './task';
import tag from './tag';
import token from './token';
import user from './user';
import slot from './slot';
import userGroup from './userGroup';

const dict = new Dict();
const schemas: Schema[] = [
    ...basicTypes,
    ...common,
    ...project,
    ...task,
    ...token,
    ...user,
    ...userGroup,
    ...slot,
    ...tag,
];
schemas.forEach(schema => dict.put(schema.doc.name, schema));

export default dict;
