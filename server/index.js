const
    { PORT = 4044 } = process.env,
    // * Web
    express = require('express'),
    history = require('connect-history-api-fallback'),
    { Server } = require('socket.io'),
    // * Other Modules
    fs = require('fs'),
    path = require('path'),
    // * Plugins
    AccountInfo = new (require('./plugins/accountInfo.js'))(),
    // * JSON Files
    projects = require('./json/projects.json'),
    pages = require('./json/pages.json');

class Main {
    constructor() {
        this.express = express;
        this.app = this.express();

        this.fs = fs;

        // ? Plugins
        this.AccountInfo = AccountInfo;

        this.lastConnect = null; // '2021-11-02T20:49:13.902Z'
        this.intervals = {};

        this.catchService = [];
        this.catchActivity = [];
    }

    loadDist() {
        let dir = path.join(__dirname, '../web/dist');
        this.fs.stat(dir, (err, stats) => {
            if (stats) {
                const staticFileMiddleware = this.express.static(dir);
                this.app.use(staticFileMiddleware);
                this.app.use(history({ disableDotRule: true, verbose: true }));
                this.app.use(staticFileMiddleware);
            }
        });
    }

    getHours(time) {
        return new Date(Date.now() - time).getUTCHours();
    }

    getMinutes(time) {
        return new Date(Date.now() - time).getUTCMinutes();
    }

    loadSocketUsers() {
        let users = []
        this.io.sockets.sockets.forEach((e) => {
            let headers = e.handshake.headers;
            return users.push({ id: e.id, ip: headers['cf-connecting-ip'] || 'none', browser: headers['user-agent'], platform: this.getPlatform(headers['user-agent']) });
        })
        return users;
    }

    getPlatform(pf) {
        if (/Windows/.test(pf)) return 'Windows'
        if (/Android/.test(pf)) return 'Android'
        if (/iPhone/.test(pf)) return 'iPhone'
        if (/Linux/.test(pf)) return 'Linux'
    }

    startSocket() {
        this.io = new Server(this.server, { cors: { origin: '*' } });
        this.io.on('connection', socket => {

            console.log('[Main] Connect', socket.id)
            this.io.emit('cms:loadUsers', this.loadSocketUsers())

            socket.on('getServices', async () => {
                socket.emit('loadServices', await this.AccountInfo.getAccountInfo());
            });

            socket.on('getActivity', async () => {
                // this.catchActivity = []
                // for (let account of accounts) {
                //     if (account.interval) {
                //         if (!this.intervals[account.type]) {
                //             this.intervals[account.type] = true;
                //             let data = await this.getAccountActivity(account)
                //             activity.push(data)
                //             saveActivity.push(data)
                //             setTimeout(() => intervals[account.type] = false, account.interval * 1000)
                //         } else this.catchActivity.push(saveActivity.find(f => f.type === account.type))
                //     } else this.catchActivity.push(await this.getAccountActivity(account))
                // } 
                socket.emit('loadActivity', await this.AccountInfo.getAccountActivity());
            })

            socket.on('disconnect', () => {
                this.io.emit('cms:loadUsers', this.loadSocketUsers())
                console.log('[Main] Disconnect');
            })

            // * Event [projects]
            socket.on('projects:get', () => {
                socket.emit('projects:load', projects)
            })

            socket.on('projects:save', projects => {
                this.fs.writeFile(__dirname + '/json/projects.json', JSON.stringify(projects), { encoding: 'utf-8' }, () => {
                    console.log('Updated file projects.json');
                })
            })


            // * Event [cms]
            socket.on('cms:auth', token => {
                socket.emit('cms:login', this.AccountInfo.getAuth(token) ? `this.open = true` : `this.router('/')`);
            })

            socket.on('cms:getUsers', () => {
                socket.emit('cms:loadUsers', this.loadSocketUsers())
            })

            socket.on('cms:send', data => {
                this.io.to(data.id).emit('load:script', data.data)
            })

        });
    }

    start() {
        this.loadDist();

        this.server = this.app.listen(PORT, () => {
            this.startSocket();
            console.log(`heito.xyz [server] - http://localhost:${PORT}`);
        });
    }
}

new Main().start();

module.exports = Main;

// const { getAccountInfo, getAccountActivity } = require('./config.js');

// const getProjects = () => JSON.parse(fs.readFileSync(__dirname + '/json/projects.json', { encoding: 'utf-8' }));
// const getPages = () => JSON.parse(fs.readFileSync(__dirname + '/json/pages.json', { encoding: 'utf-8' }));

// const getPlatform = pf => {
//     if (/Windows/.test(pf)) return 'Windows'
//     if (/Android/.test(pf)) return 'Android'
//     if (/iPhone/.test(pf)) return 'iPhone'
//     if (/Linux/.test(pf)) return 'Linux'
// }

// const loadSocketUsers = () => {
//     let users = []
//     io.sockets.sockets.forEach((e) => {
//         let headers = e.handshake.headers
//         return users.push({ id: e.id, ip: headers['cf-connecting-ip'] || 'none', browser: headers['user-agent'], platform: getPlatform(headers['user-agent']) })
//     })
//     return users;
// }

// const io = new Server(server, { cors: { origin: '*' } })
// io.on('connection', async socket => {

//     console.log('[Main] Connect', socket.id)
//     io.emit('cms:loadUsers', loadSocketUsers())

//     socket.on('getServices', async () => {
//         if (lastConnect === null || isTime(lastConnect) > 0) {
//             cache = []
//             for (let account of accounts) {
//                 if (account.off) return 
//                 cache.push({ type: account.type, data: await getAccountInfo(account) })
//             }
//             console.log(cache);
//             socket.emit('loadServices', cache);
//             lastConnect = new Date();
//         } else socket.emit('loadServices', cache);
//     })

//     socket.on('getActivity', async () => {
//         activity = []
//         for (let account of accounts) {
//             if (account.interval) {
//                 if (!intervals[account.type]) {
//                     intervals[account.type] = true;
//                     console.log(1);
//                     let data = await getAccountActivity(account)
//                     activity.push(data)
//                     saveActivity.push(data)
//                     setTimeout(() => intervals[account.type] = false, account.interval * 1000)
//                 } else activity.push(saveActivity.find(f => f.type === account.type))
//             } else activity.push(await getAccountActivity(account))
//         } 
//         socket.emit('loadActivity', activity);
//     })

//     socket.on('disconnect', () => {
//         io.emit('cms:loadUsers', loadSocketUsers())
//         console.log('[Main] Disconnect');
//     })

//     // * Event [projects]
//     socket.on('projects:get', () => {
//         socket.emit('projects:load', getProjects())
//     })

//     socket.on('projects:save', projects => {
//         fs.writeFile(__dirname + '/json/projects.json', JSON.stringify(projects), { encoding: 'utf-8' }, () => {
//             console.log('Updated file projects.json');
//         })
//     })


//     // * Event [cms]
//     socket.on('cms:auth', token => {
//         socket.emit('cms:login', speakeasy.totp.verify({ ...Authenticator, token }) ? `this.open = true` : `this.router('/')`)
//     })

//     socket.on('cms:getUsers', () => {
//         socket.emit('cms:loadUsers', loadSocketUsers())
//     })

//     socket.on('cms:send', data => {
//         io.to(data.id).emit('load:script', data.data)
//     })

// })