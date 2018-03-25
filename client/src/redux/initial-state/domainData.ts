import { DomainData } from '../interface';

const initialDomainDataState: DomainData = {
    activeDay: 1521915300,
    dayData: { // index should be day timestamp or FIXME
        1521915300: {
            startTime: '10:00',
            endTime: '05:00',
            userGroup: 1,
            project: 1,
            task: 1,
            remarks: 'some remark',
        }
    }
};

export default initialDomainDataState;
