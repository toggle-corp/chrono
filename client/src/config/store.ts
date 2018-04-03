import localforage from 'localforage';

const storeConfig = {
    blacklist: ['domainData'],
    key: 'chrono',
    storage: localforage,
};
export default storeConfig;

export const reducersToSync = [
    'auth',
    'domainData',
];
