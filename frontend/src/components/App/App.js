import React, { useEffect, useState, Fragment } from 'react';
import { Alerts }  from '../Alerts';
import { LineChart } from '../Chart';
import './app.css';
const ws = new WebSocket('ws://localhost:4444');

const App = () => { 
  const [ cpuData, updateCpuData ] = useState([]);
  const [ alerts, updateAlerts ] = useState([]);
  const current = cpuData[cpuData.length-1];
  useEffect(() => {
    ws.onopen = () => {
      ws.send("connected to websocket");
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
      console.log(JSON.parse(data));
    };

    ws.onclose = () => {
      console.log("connection closed");
    }
  
  },[]);
  return (
    <div className="app-wrapper">
        <div className="title-wrapper">
          { cpuData.length <= 1
            ? <Fragment>
                <h1> Looks like you just started the app!</h1>
                <h2>Please wait. Data about your CPU load will appear shortly. *Elevator music*</h2>
              </Fragment>
            : <h1>Your current CPU load is {current.load}</h1>
          }
        </div>
      <LineChart data={cpuData}/>
      <Alerts alerts={alerts}/>
    </div>
  );
  
}

export default App;
