const os = require('os');


class LoadObserver {
    constructor(){
        this.twoMinuteWindow = [];
        this.isAlert = false;    
    }
    //methods for testing only
    getTwoMinuteWindow = () => this.twoMinuteWindow;
    //methods for testing only
    getIsAlert = () => this.isAlert;

    getAverageCPUData = () => {
        const cpus = os.cpus().length
        const loadAverage = os.loadavg()[0] / cpus;
        const load = Math.round(loadAverage * 100) / 100;
        const timestamp = Date.now();
        //const timestamp = new Date(Date.now()).toLocaleTimeString();
        return {
            load,
            timestamp
        }
    }
    
    handleTwoMinuteWindow = (currentCPUInfo) => {
        //3.1.If current cpu load is more than normal we add it to buffer
        if(currentCPUInfo.load >= 1){
            //3.2 high cpu buffer should be 2 minutes long
            if(this.twoMinuteWindow.length === 12){
                this.twoMinuteWindow.shift();
            }
            this.twoMinuteWindow.push(currentCPUInfo);
        }
        //3.3 if cpu load is smaller than 1 and we have stuff in buffer
        // we remove one
        if(currentCPUInfo.load < 1 && this.twoMinuteWindow.length > 0){
            this.twoMinuteWindow.shift();//maybe remove oldest one
        }
    }
    
    getAlert = (currentCPUInfo) => {
        //4. if we removed everything from high cpu buffer and there was alert
        // then we know it's recovered
        if(this.twoMinuteWindow.length === 0 && this.isAlert){
            this.isAlert = false;
            return {
                message: "YOUR CPU HAS RECOVERED",
                timestamp: currentCPUInfo.timestamp
            };
        }
        //5. if buffer is full and there was no alert
        // this means our CPU is in danger and we need to notify about it
        if(this.twoMinuteWindow.length === 12 && !this.isAlert){
            this.isAlert = true;
            return {
                message: "UNDER HIGH LOAD",
                timestamp: this.twoMinuteWindow[0].timestamp
            }
        }
    
        return null;
    }

    getIntervalInfo = () => {
        const currentCPUInfo = this.getAverageCPUData();
        this.handleTwoMinuteWindow(currentCPUInfo);
        const alert = this.getAlert(currentCPUInfo);
        return {
            currentCPUInfo,
            alert
        };
    }
    
}


module.exports = new LoadObserver();

