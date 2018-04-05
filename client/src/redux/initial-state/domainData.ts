import { DomainData } from '../interface';

const initialDomainDataState: DomainData = {
    activeDay: '2017-10-10',
    userGroups: [],
    slotData: {
        // index should be day timestamp or FIXME
        startTime: '10:00',
        endTime: '05:00',
        date: '2017-10-10',
        id: 1,
        user: 1,
        task: 1,
        remarks: 'some remark',
    },
};

export default initialDomainDataState;
