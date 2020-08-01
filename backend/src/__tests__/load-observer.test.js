const os = require('os');
const nativeLoadavg = os.loadavg
const loadObserver = require('../load-observer');



describe('getAverageCPUData', () => {
    beforeAll(()=> {
       jest.spyOn(Date, 'now').mockImplementation(() => 1596123545035);
       jest.spyOn(os,'loadavg').mockImplementation(() => [ 2.40, 2.43, 2.36 ]);
       jest.spyOn(os,'cpus').mockImplementation(() => [1,2,3,4,5,6,7,8]);
    })

    afterAll(() => {
        jest.restoreAllMocks()
    });

    it('should return average cpu data', () => {
        const data = loadObserver.getAverageCPUData();
        expect(data).toMatchObject({ load: 0.3, timestamp: 1596123545035 })
    });

})

describe('handleTwoMinuteWindow', () => {

    it('should not add load to window if it is less than 1', () => {
        const data = { load: 0.3, timestamp: 1596123545035 };
        loadObserver.handleTwoMinuteWindow(data);
        const twoMinuteWindow = loadObserver.getTwoMinuteWindow();
        expect(twoMinuteWindow).toHaveLength(0);
    });

    it('should add load to window if it is more than 1', () => {
        const data = { load: 1, timestamp: 1596123545035 };
        loadObserver.handleTwoMinuteWindow(data);
        const twoMinuteWindow = loadObserver.getTwoMinuteWindow();
        expect(twoMinuteWindow).toHaveLength(1);
    });

    it('window should not have more that 12 items', () => {
        const arrayOfDataObjects = [
            { load: 1.1, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 1.5, timestamp: 1596123545035 },
            { load: 1.9, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 1.5, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 1.2, timestamp: 1596123545035 },
            { load: 1.1, timestamp: 1596123545035 },
            { load: 2.1, timestamp: 1596123545035 },
            { load: 3.5, timestamp: 1596123545035 },
            { load: 1.2, timestamp: 1596123545035 },
        ];
        for(let data of arrayOfDataObjects){
            loadObserver.handleTwoMinuteWindow(data);
        }
        const twoMinuteWindow = loadObserver.getTwoMinuteWindow();
        expect(twoMinuteWindow).toHaveLength(12);
    });

    it('window be empty after cooling down', () => {
        const arrayOfHighCPUObjects = [
            { load: 1.1, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 1.5, timestamp: 1596123545035 },
            { load: 1.9, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 1.5, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 1.2, timestamp: 1596123545035 },
            { load: 1.1, timestamp: 1596123545035 },
            { load: 2.1, timestamp: 1596123545035 }
        ];
        for(let data of arrayOfHighCPUObjects){
            loadObserver.handleTwoMinuteWindow(data);
        }
        const arrayOfLowCPUObjects = [
            { load: 0.9, timestamp: 1596123545035 },
            { load: 0.8, timestamp: 1596123545035 },
            { load: 0.5, timestamp: 1596123545035 },
            { load: 0.5, timestamp: 1596123545035 },
            { load: 0.9, timestamp: 1596123545035 },
            { load: 0.3, timestamp: 1596123545035 },
            { load: 0.5, timestamp: 1596123545035 },
            { load: 0.4, timestamp: 1596123545035 },
            { load: 0.3, timestamp: 1596123545035 },
            { load: 0.2, timestamp: 1596123545035 },
            { load: 0.1, timestamp: 1596123545035 },
            { load: 0.1, timestamp: 1596123545035 }
        ];
        for(let data of arrayOfLowCPUObjects){
            loadObserver.handleTwoMinuteWindow(data);
        }
        const twoMinuteWindow = loadObserver.getTwoMinuteWindow();
        expect(twoMinuteWindow).toHaveLength(0);
    });
});

describe('getAlert', () => {
    it('should return alert with warning if average cpu was higher than 1 for 2 minutes', () => {
        const arrayOfHighCPUObjects = [
            { load: 1.1, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 1.5, timestamp: 1596123545035 },
            { load: 0.9, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 0.8, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 0.9, timestamp: 1596123545035 },
            { load: 1.5, timestamp: 1596123545035 },
            { load: 1.2, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 1.1, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 1.2, timestamp: 1596123545035 }
        ];

        for(let data of arrayOfHighCPUObjects){
            loadObserver.handleTwoMinuteWindow(data);
        }

        const alert = loadObserver.getAlert(arrayOfHighCPUObjects[arrayOfHighCPUObjects.length-1]);
        expect(alert).toMatchObject({ type: 'warning', timestamp: 1596123545035 })
    });

    it('should return alert with message that cpu is recovered if average cpu load was lower than 1 for 2 minutes', () => {

        const arrayOfHighCPUObjects = [
            { load: 1.1, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 1.5, timestamp: 1596123545035 },
            { load: 0.9, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 0.8, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 0.9, timestamp: 1596123545035 },
            { load: 1.5, timestamp: 1596123545035 },
            { load: 1.2, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 1.1, timestamp: 1596123545035 },
            { load: 1.3, timestamp: 1596123545035 },
            { load: 1.4, timestamp: 1596123545035 },
            { load: 1.2, timestamp: 1596123545035 }
        ];

        for(let data of arrayOfHighCPUObjects){
            loadObserver.handleTwoMinuteWindow(data);
        }
        const arrayOfLowCPUObjects = [
            { load: 0.9, timestamp: 1596123545035 },
            { load: 0.8, timestamp: 1596123545035 },
            { load: 0.5, timestamp: 1596123545035 },
            { load: 0.5, timestamp: 1596123545035 },
            { load: 0.9, timestamp: 1596123545035 },
            { load: 0.3, timestamp: 1596123545035 },
            { load: 0.5, timestamp: 1596123545035 },
            { load: 0.4, timestamp: 1596123545035 },
            { load: 0.3, timestamp: 1596123545035 },
            { load: 0.2, timestamp: 1596123545035 },
            { load: 0.1, timestamp: 1596123545035 },
            { load: 0.1, timestamp: 1596123545035 }
        ];

        for(let data of arrayOfLowCPUObjects){
            loadObserver.handleTwoMinuteWindow(data);
        }

        const alert = loadObserver.getAlert(arrayOfLowCPUObjects[arrayOfLowCPUObjects.length-1]);
        expect(alert).toMatchObject({ type: 'recovery', timestamp: 1596123545035 })
    });

});

describe('getIntervalInfo', () => {
    beforeAll(()=> {
        jest.spyOn(Date, 'now').mockImplementation(() => 1596123545035);
        jest.spyOn(os,'loadavg').mockImplementation(() => [ 2.40, 2.43, 2.36 ]);
        jest.spyOn(os,'cpus').mockImplementation(() => [1,2,3,4,5,6,7,8]);
     })
 
     afterAll(() => {
         jest.restoreAllMocks()
     });
 
    it('should return data about CPU load during normal conditions', () => {
        const { currentCPUInfo, alert } = loadObserver.getIntervalInfo();
        expect(currentCPUInfo).toMatchObject({ load: 0.3, timestamp: 1596123545035 });
        expect(alert).toBe(null);
    });
});