const express = require('express');
const app = express();
const history = require('connect-history-api-fallback');
const WebSocket = require('ws');
const fs = require('fs');
const { Server } = require('socket.io');

const PORT = {
    express: 4044,
    ws: 4043
};

const { services, getAccount, getSpotifyState, getSteamActivity } = require('./config.js')
const { steam } = require('./cfg.js')

let lastConnect = null; // '2021-11-02T20:49:13.902Z'

let activity = []
let cache = []

const isTime = () => Math.floor((Date.parse(new Date()) - Date.parse(lastConnect)) / 3600000);

fs.stat('./dist', (err, stats) => {
    if (stats) {
        const staticFileMiddleware = express.static('./dist');
        app.use(staticFileMiddleware);
        app.use(history({ disableDotRule: true, verbose: true }));
        app.use(staticFileMiddleware);
    }
})

const server = app.listen(PORT.express, () => console.log(`heito.xyz [server] - http://localhost:${PORT.express}`))

const io = new Server(server, { cors: { origin: '*' } })
io.on('connection', async socket => {

    console.log('[Main] Connect')

    const sendActivity = async () => {
        if (socket.disconnected) return
        activity = []
        activity.push(await getSpotifyState())
        for (let id of steam.ids) activity.push(await getSteamActivity(id))
        socket.emit('loadActivity', activity);
        setTimeout(() => sendActivity(), 5000)
    }

    if (lastConnect === null || isTime() >= 1) {
        cache = []
        for (let service of services) {
            if (service === 'steam') {
                for (let id of steam.ids) {
                    cache.push({ type: 'steam', data: await getAccount(service, id) })
                }
            } else cache.push({ type: service, data: await getAccount(service) })
        }
        socket.emit('loadServices', cache);
        lastConnect = new Date();
    } else socket.emit('loadServices', cache);

    sendActivity()

    socket.on('disconnect', () => {
        console.log('[Main] Disconnect');
    })
})