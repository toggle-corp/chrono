import dict from '../vendor/ravl/schema';
import attachValidator from '../vendor/ravl/attachValidator';

import common from './common';
import project from './project';
import task from './task';
import token from './token';
import user from './user';
import slot from './slot';
import userGroup from './userGroup';

// Validator mixin
attachValidator(dict);

// ATTACHING SCHEMAS
[
    ...common,
    ...project,
    ...task,
    ...token,
    ...user,
    ...userGroup,
    ...slot,
].forEach(schema => dict.put(schema.doc.name, schema));

export default dict;
