const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const monitor = require('./monitor');

const app = express();
const PORT = 4444;


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', () => {
        setInterval(monitor.handleMonitor, 10000, ws);        
    })
    ws.on('close', function () {
        console.log('stopping client interval');
        //clearInterval(interval);
        ws.terminate();
    });
});



server.listen(PORT, (err) => {
    if (err) {
        throw err;
    }

    console.log(`Server running on port ${PORT}!`);
});
