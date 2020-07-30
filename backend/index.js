const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const loadObserver = require('./src/load-observer');

const app = express();
const PORT = 4444;


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = [];

wss.on('connection', (ws) => {
    ws.on('message', () => {
        const interval = setInterval(() => {
            const { data, alert } = loadObserver.getIntervalInfo();
            ws.send(JSON.stringify({
                data,
                alert
            }));

        }, 10000);
    })
    ws.on('close', function () {
        console.log('stopping client interval');
        clearInterval(interval);
        ws.terminate();
    });
});



server.listen(PORT, (err) => {
    if (err) {
        throw err;
    }

    console.log(`Server running on port ${PORT}!`);
});
