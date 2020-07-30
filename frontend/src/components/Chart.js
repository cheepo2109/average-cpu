import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
const Chart = ({ticks}) => {
    return (
        <AreaChart
            width={500}
            height={300}
            data={ticks}
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
    );
};

export default Chart;