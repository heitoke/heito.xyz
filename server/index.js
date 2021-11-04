const express = require('express');
const app = express();
const history = require('connect-history-api-fallback');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 1000, path: '/main' });

const PORT = 1001;

const { cfg, getAccount, getSpotifyState, getSteamActivity } = require('./config.js')

let lastConnect = null; // '2021-11-02T20:49:13.902Z' // new Date()

let activity = []
let cache = []

const isTime = () => Math.floor((Date.parse(new Date()) - Date.parse(lastConnect)) / 3600000);
console.log(isTime());

// const staticFileMiddleware = express.static('./dist');

// app.use(staticFileMiddleware);
// app.use(history({
//     disableDotRule: true,
//     verbose: true
// }));
// app.use(staticFileMiddleware);

wss.on('connection', async ws => {

    console.log('[Main] Connect')

    const sendActivity = async () => {
        if (ws.disconnect) return
        activity = []
        activity.push(await getSpotifyState())
        for (let id of cfg.steam) activity.push(await getSteamActivity(id))
        ws.send(JSON.stringify({ type: 'loadActivity', data: activity }))
        setTimeout(() => sendActivity(), 5000)
    }

    if (lastConnect === null || isTime() >= 1) {
        cache = []
        for (let service in cfg) {
            if (service === 'steam') {
                for (let id of cfg.steam) {
                    cache.push({ type: 'steam', data: await getAccount(service, id) })
                }
            } else cache.push({ type: service, data: await getAccount(service) })
        }
        ws.send(JSON.stringify({ type: 'loadServices', data: cache }));
        lastConnect = new Date();
    } else ws.send(JSON.stringify({ type: 'loadServices', data: cache }));

    sendActivity()

    ws.on('close', () => {
        console.log('[Main] Disconnect');
        ws.disconnect = true
    })
});

app.listen(PORT, () => console.log(`heito.xyz [server] - http://localhost:${PORT}`))