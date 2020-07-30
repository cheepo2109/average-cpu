import React, { useEffect, useState, Component } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

import './App.css';

class App extends Component { 

  state = {
    ticks:[],
    highCPUStack:[],
    alerts:[],
    isOverloaded:false
  }
  ws = new WebSocket('ws://localhost:4444');

  componentDidMount(){
    this.ws.onopen = (data) => {
      this.ws.send("started");
    };
    
    this.ws.onmessage = (event) => {
      const { data } = JSON.parse(event.data);
      if(data.load){
        this.setState(prevState => {
          const updateTicks = prevState.ticks.length === 60 ? prevState.ticks.slice(1) : prevState.ticks;
          return { ticks: [...updateTicks, data] };
        })
      }
      console.log(data);
      
    };
  }
  render(){
    return (
      <div className="App">
        <AreaChart
          width={500}
          height={300}
          data={this.state.ticks}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" domain={[0, "dataMax"]} />
          <YAxis dataKey="load" domain={[0, 1]} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="timestamp" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Area type="monotone" dataKey="load" stroke="#82ca9d" />
        </AreaChart>
      </div>
    );
  }
}

export default App;
