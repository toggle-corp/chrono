import localforage from 'localforage';
import { createTransform } from 'redux-persist';
import { SiloDomainData } from '../redux/interface';
import update from '#rsu/immutable-update';

const myTransform = createTransform(
    (inboundState: SiloDomainData) => {
        // NOTE: clears out activeDate and activeTimeSlotId on refresh
        const settings = {
            workspace: {
                activeDate: { $set: {} },
                activeTimeSlotId: { $set: undefined },
            },
        };
        return update(inboundState, settings);
    },
    outBoundState => outBoundState,
    { whitelist: ['siloDomainData'] },
);

const storeConfig = {
    blacklist: ['notify', 'route'],
    key: 'chrono',
    storage: localforage,
    transforms: [myTransform],
};
export default storeConfig;

export const reducersToSync = [
    'auth',
    'domainData',
    'taskManager', // middleware
];
