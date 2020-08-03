const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const loadObserver = require('./src/load-observer');

const app = express();
const PORT = 4444;


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const INTERVAL = 10000;

wss.on('connection', (ws) => {
    console.log("Received connection");
    let interval;
    ws.on('message', () => {
        console.log("Received Message");
        interval = setInterval(() => {
            const { currentCPUInfo, alert } = loadObserver.getIntervalInfo();
            ws.send(JSON.stringify({
                currentCPUInfo,
                alert,
            }));
        }, INTERVAL);
    })
    ws.on('close', function () {
        console.log('stopping client interval');
        clearInterval(interval);
        loadObserver.clear();
        ws.terminate();
    });
});



server.listen(PORT, (err) => {
    if (err) {
        throw err;
    }

    console.log(`Server running on port ${PORT}!`);
});
