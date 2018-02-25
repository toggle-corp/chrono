import React from 'react';

import ViewManager from '../common/components/ViewManager';

const importers = {
    landing: () => import('./Landing'),
    login: () => import('./Login'),
    register: () => import('./Register'),
    team: () => import('./Team'),
    workspace: () => import('./Workspace'),
};

const views = Object.keys(importers).reduce(
    (acc, key) => {
        const importer = importers[key];
        acc[key] = props => (
            <ViewManager
                {...props}
                load={importer}
            />
        );
        return acc;
    },
    {},
);

export default views;
