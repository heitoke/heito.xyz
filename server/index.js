const express = require('express');
const app = express();
const history = require('connect-history-api-fallback');
const fs = require('fs');
const { Server } = require('socket.io');
const speakeasy = require('speakeasy');

const PORT = 4044

const { getAccountInfo, getAccountActivity } = require('./config.js')
const { accounts, Authenticator } = require('./cfg.js')

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

const server = app.listen(PORT, () => console.log(`heito.xyz [server] - http://localhost:${PORT}`))

const getProjects = () => JSON.parse(fs.readFileSync('./json/projects.json', { encoding: 'utf-8' }));
const getPages = () => JSON.parse(fs.readFileSync('./json/pages.json', { encoding: 'utf-8' }));

const getPlatform = pf => {
    if (/Windows/.test(pf)) return 'Windows'
    if (/Android/.test(pf)) return 'Android'
    if (/iPhone/.test(pf)) return 'iPhone'
    if (/Linux/.test(pf)) return 'Linux'
}

const loadSocketUsers = () => {
    let users = []
    io.sockets.sockets.forEach((e) => {
        let headers = e.handshake.headers
        return users.push({ id: e.id, ip: headers['cf-connecting-ip'] || 'none', browser: headers['user-agent'], platform: getPlatform(headers['user-agent']) })
    })
    return users;
}

const io = new Server(server, { cors: { origin: '*' } })
io.on('connection', async socket => {

    console.log('[Main] Connect', socket.id)
    io.emit('cms:loadUsers', loadSocketUsers())

    socket.on('getServices', async () => {
        if (lastConnect === null || isTime() > 0) {
            cache = []
            for (let account of accounts) {
                if (account.off) return 
                cache.push({ type: account.type, data: await getAccountInfo(account) })
            }
            console.log(cache);
            socket.emit('loadServices', cache);
            lastConnect = new Date();
        } else socket.emit('loadServices', cache);
    })

    socket.on('getActivity', async () => {
        activity = []
        for (let account of accounts) {
            activity.push(await getAccountActivity(account))
        } 
        socket.emit('loadActivity', activity);
    })

    socket.on('disconnect', () => {
        io.emit('cms:loadUsers', loadSocketUsers())
        console.log('[Main] Disconnect');
    })

    // * Event [projects]
    socket.on('projects:get', () => {
        console.log(getProjects());
        socket.emit('projects:load', getProjects())
    })

    socket.on('projects:save', projects => {
        fs.writeFile('./projects.json', JSON.stringify(projects), { encoding: 'utf-8' }, () => {
            console.log('Updated file projects.json');
        })
    })


    // * Event [cms]
    socket.on('cms:auth', token => {
        socket.emit('cms:login', speakeasy.totp.verify({ ...Authenticator, token }) ? `this.open = true` : `this.router('/')`)
    })

    socket.on('cms:getUsers', () => {
        socket.emit('cms:loadUsers', loadSocketUsers())
    })

    socket.on('cms:send', data => {
        io.to(data.id).emit('load:script', data.data)
    })

})