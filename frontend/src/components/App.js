import React, { useEffect, useState } from 'react';
import Chart from './Chart';
import Alerts from './Alerts';

const ws = new WebSocket('ws://localhost:4444');

const App = () => { 
  const [ ticks, updateTicks ] = useState([]);
  const [ alerts, updateAlerts ] = useState([]);

  useEffect(() => {
    ws.onopen = (data) => {
      ws.send("started");
    };

    ws.onmessage = (event) => {
      const { currentCPUInfo, alert } = JSON.parse(event.data);
      updateTicks(prevTicks => {
        const newTicks = prevTicks.length === 60 ? prevTicks.slice(1) : prevTicks;
        return [...newTicks, currentCPUInfo];
      })

      if(alert){
        updateAlerts(prevAlerts => [...prevAlerts, alert])
      }
      console.log(event.data)
    };
  },[]);
  useEffect(() => {
    console.log(alerts)
  }, [alerts])
  return (
    <div className="App">
      <Chart ticks={ticks}/>
      <Alerts alerts={alerts}/>
    </div>
  );
  
}

export default App;
