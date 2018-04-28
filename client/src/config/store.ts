import localforage from 'localforage';

const storeConfig = {
    // FIXME: siloDomainData is blacklisted for dev
    blacklist: ['notify', 'route', 'siloDomainData'],
    key: 'chrono',
    storage: localforage,
};
export default storeConfig;

export const reducersToSync = [
    'auth',
    'domainData',
    'taskManager', // middleware
];
