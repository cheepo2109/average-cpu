import React, { useEffect, useState, Fragment } from 'react';
import { Alerts}  from '../Alerts';
import { LineChart } from '../Chart';
import './app.css';
const ws = new WebSocket('ws://localhost:4444');

const App = () => { 
  const [ cpuData, updateCpuData ] = useState([]);
  const [ alerts, updateAlerts ] = useState([]);

  useEffect(() => {

    ws.onopen = () => {
      ws.send("started");
    };

    ws.onmessage = ({ data }) => {
      let { currentCPUInfo, alert } = JSON.parse(data);
      updateCpuData(prev => {
        const prevCpuData = prev.length === 60 ? prev.slice(1) : prev;
        return [...prevCpuData, currentCPUInfo];
      })
      if(alert){
        updateAlerts(prevAlerts => [alert,...prevAlerts])
      }
    };
  
  },[]);
  useEffect(() => {
    console.log(alerts)
  }, [alerts])
  return (
    <div className="app-wrapper">
        <div className="title-wrapper">
          { cpuData.length <= 1
            ? <Fragment>
                <h1> Looks like you just started the app!</h1>
                <h2>Please wait. Data about your CPU load will appear shortly. *Elevator music*</h2>
              </Fragment>
            : <h1>Here's your current CPU Load</h1>
          }
        </div>
      <LineChart data={cpuData}/>
      <Alerts alerts={alerts}/>
    </div>
  );
  
}

export default App;
