import localforage from 'localforage';

const storeConfig = {
    blacklist: ['domainData', 'notify'],
    key: 'chrono',
    storage: localforage,
};
export default storeConfig;

export const reducersToSync = [
    'auth',
    'domainData',
    'taskManager', // middleware
];
