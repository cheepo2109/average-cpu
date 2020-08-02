const os = require('os');

const THRESHOLD = 1;
const ALERT_THRESHOLD = 12; // 2 mins is 12 intervals by 10 seconds

class LoadObserver {
    constructor(){
        this.highLoadWindow = [];
        this.isAlert = false;    
    }
    //methods for testing only
    getHighLoadWindow = () => this.highLoadWindow;
    //methods for testing only
    getIsAlert = () => this.isAlert;

    clear = () => {
        this.highLoadWindow = [];
        this.isAlert = false;
    }
    
    getAverageCPUData = () => {
        const cpus = os.cpus().length
        const loadAverage = os.loadavg()[0] / cpus;
        const load = Math.round(loadAverage * 100) / 100;
        const timestamp = Date.now();
        return {
            load,
            timestamp
        }
    }
    
    handleHighLoadWindow = (currentCPUInfo) => {
        //3.1.If current cpu load is more than normal we add it to buffer
        if(currentCPUInfo.load >= THRESHOLD){
            //3.2 high cpu buffer should be 2 minutes long
            if(this.highLoadWindow.length === ALERT_THRESHOLD){
                this.highLoadWindow.shift();
            }
            this.highLoadWindow.push(currentCPUInfo);
        }
        //3.3 if cpu load is smaller than 1 and we have stuff in buffer
        // we remove one
        if(currentCPUInfo.load < THRESHOLD && this.highLoadWindow.length > 0){
            this.highLoadWindow.shift();//maybe remove oldest one
        }
    }
    
    getAlert = (currentCPUInfo) => {
        //4. if we removed everything from high cpu buffer and there was alert
        // then we know it's recovered
        if(this.highLoadWindow.length === 0 && this.isAlert){
            this.isAlert = false;
            return {
                type: "recovery",
                timestamp: currentCPUInfo.timestamp
            };
        }
        //5. if buffer is full and there was no alert
        // this means our CPU is in danger and we need to notify about it
        if(this.highLoadWindow.length === ALERT_THRESHOLD && !this.isAlert){
            this.isAlert = true;
            return {
                type: "warning",
                timestamp: this.highLoadWindow[0].timestamp
            }
        }
    
        return null;
    }

    getIntervalInfo = () => {
        const currentCPUInfo = this.getAverageCPUData();
        this.handleHighLoadWindow(currentCPUInfo);
        const alert = this.getAlert(currentCPUInfo);
        return {
            currentCPUInfo,
            alert
        };
    }
    
}


module.exports = new LoadObserver();

