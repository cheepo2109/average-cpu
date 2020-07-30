const os = require('os');

const twoMinuteWindow = [];
let isAlert = false;


const getAverageCPUData = () => {
    const cpus = os.cpus().length
    const loadAverage = os.loadavg()[0] / cpus;
    const load = Math.round(loadAverage * 100) / 100;
    //const timestamp = new Date().getTime();
    const timestamp = new Date(Date.now()).toLocaleTimeString();
    return {
        load,
        timestamp
    }
}

const handleTwoMinuteWindow = (data) => {
    //3.1.If current cpu load is more than normal we add it to buffer
    if(data.load >= 1){
        //3.2 high cpu buffer should be 2 minutes long
        if(twoMinuteWindow.length === 12){
            twoMinuteWindow.shift();
        }
        twoMinuteWindow.push(data);
    }
    //3.3 if cpu load is smaller than 1 and we have stuff in buffer
    // we remove one
    if(data.load < 1 && twoMinuteWindow.length > 0){
        twoMinuteWindow.pop();//maybe remove oldest one
    }
}

const getAlert = (timestamp) => {
    //4. if we removed everything from high cpu buffer and there was alert
    // then we know it's recovered
    if(twoMinuteWindow.length === 0 && isAlert){
        isAlert = false;
        return {
            message: "YOUR CPU HAS RECOVERED",
            timestamp
        };
    }
    //5. if buffer is full and there was no alert
    // this means our CPU is in danger and we need to notify about it
    if(twoMinuteWindow.length === 12 && !isAlert){
        isAlert = true;
        return {
            message: "UNDER HIGH LOAD",
            timestamp: twoMinuteWindow[0].timestamp
        }
    }

    return null;
}

const getIntervalInfo = () => {
    const data = getAverageCPUData();
    handleTwoMinuteWindow(data);
    const alert = getAlert(data);
    return {
        data,
        alert
    };
}


module.exports = {
    getIntervalInfo,
    getAlert,
    handleTwoMinuteWindow,
    getAverageCPUData
}

