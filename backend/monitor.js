const os = require('os');
const history = [];
let twoMinuteWindow = [];
let isAlert = false;

const checkAlert = (ws) => {
    const twoMinuteLoad = twoMinuteWindow.reduce((prev, curr) => prev + curr.load,0);
    const twoMinuteAverage = twoMinuteLoad / twoMinuteWindow.length;
    if(twoMinuteAverage >= 1){
        isAlert = true;
        return true;
    }
    return false
}

const handleMonitor = (ws) => {
    console.log("test");
    const cpus = os.cpus().length
    const loadAverage = os.loadavg()[0] / cpus;
    const load = Math.round(loadAverage * 100) / 100;
    //const timestamp = new Date().getTime();
    const timestamp = new Date(Date.now()).toLocaleTimeString();
    console.log(timestamp);
    let data = {
        load,
        timestamp
    }
    //1. On every data point we push it to history
    history.push(data);
    //2. If history is longer than 10 minutes, we remove oldest one
    if(history.length > 60){
        history.shift();
    }
    //3.1.If current cpu load is more than normal we add it to buffer
    if(load >= 1){
        //3.2 high cpu buffer should be 2 minutes long
        if(twoMinuteWindow.length === 12){
            twoMinuteWindow.shift();
        }
        twoMinuteWindow.push(data);
    }
    //3.3 if cpu load is smaller than 1 and we have stuff in buffer
    // we remove one
    if(load < 1 && twoMinuteWindow.length > 0){
        twoMinuteWindow.pop();//maybe remove oldest one
    }

    //4. if we removed everything from high cpu buffer and there was alert
    // then we know it's recovered
    if(twoMinuteWindow.length === 0 && isAlert){
        data.alertType = "GOOD"
        isAlert = false;
    }
    //5. if buffer is full and there was no alert
    // this means our CPU is in danger and we need to notify about it
    if(twoMinuteWindow.length === 12 && !isAlert){
        const highCPU = checkAlert(ws);
        if(highCPU){
            data.alertType = "BAD"
        }
    }


    ws.send(JSON.stringify({
        data
    }));
}



exports.handleMonitor = handleMonitor;

