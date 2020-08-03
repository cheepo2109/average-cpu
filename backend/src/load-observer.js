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
    //cleat state
    clear = () => {
        this.highLoadWindow = [];
        this.isAlert = false;
    }
    
    /**
     * @function getAverageCPUData
     * 
     * @returns {{load, timestamp }} Average CPU load for last minute and timestamp when it was obtained
     */
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
    /**
     * Function that processes current average cpu load
     * 
     * @param {{ load, timestamp }} currentCPUInfo 
     */
    handleHighLoadWindow = (currentCPUInfo) => {
        //2.1.If current cpu load is more than normal we add it to window/queue/buffer
        if(currentCPUInfo.load >= THRESHOLD){
            //2.1.1 High cpu window should be 2 minutes long
            //so if it's longer than 2 minutes, we remove oldest one
            if(this.highLoadWindow.length === ALERT_THRESHOLD){
                this.highLoadWindow.shift();
            }
            this.highLoadWindow.push(currentCPUInfo);
        }
        //2.3 If cpu load is smaller than threshold and we have stuff in buffer,
        // that proabaly means and our cpu starts to recover, so we remove oldest one
        if(currentCPUInfo.load < THRESHOLD && this.highLoadWindow.length > 0){
            this.highLoadWindow.shift();
        }
    }
    /**
     * Function where we detect if need to send alert or not
     * 
     * @param {{ load, timestamp }} currentCPUInfo 
     *
     * @returns { {type, timestamp} | null } If there's alert, we return alert object, otherwise null
     */
    getAlert = (currentCPUInfo) => {
        //3(A) if we removed everything from high cpu window and there was alert
        // then we know that cpu is recovered
        if(this.highLoadWindow.length === 0 && this.isAlert){
            this.isAlert = false;
            return {
                type: "recovery",
                timestamp: currentCPUInfo.timestamp
            };
        }
        //3(B) If buffer is full and there was no alert
        // this means our CPU is under high pressure and we need to notify about it
        if(this.highLoadWindow.length === ALERT_THRESHOLD && !this.isAlert){
            this.isAlert = true;
            return {
                type: "warning",
                timestamp: this.highLoadWindow[0].timestamp
            }
        }
        //3(C) Otherwise we don't send anything
        return null;
    }

    /**
     * @function getIntervalInfo is the one that integrates everything above
     */
    getIntervalInfo = () => {
        //1. Getting information about CPU average load
        const currentCPUInfo = this.getAverageCPUData();
        //2. We process information we retrieved in the previous step
        this.handleHighLoadWindow(currentCPUInfo);
        //3. If previous step created and alert, we get it
        const alert = this.getAlert(currentCPUInfo);
        //4. And send everything to a user
        return {
            currentCPUInfo,
            alert
        };
    }
    
}


module.exports = new LoadObserver();

