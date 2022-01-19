const
    { PORT = 4044 } = process.env,
    // * Web
    express = require('express'),
    history = require('connect-history-api-fallback'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    // * Other Modules
    fs = require('fs'),
    path = require('path'),
    // * Plugins
    AccountInfo = new (require('./plugins/accountInfo.js'))();

class Main {
    constructor() {
        this.express = express;
        this.app = this.express();

        this.fs = fs;
        this.path = path;

        // ? Plugins
        this.AccountInfo = AccountInfo;

        this.lastConnect = null; // '2021-11-02T20:49:13.902Z'
        this.intervals = {};

        this.catchService = [];
        this.catchActivity = [];
    }

    loadHeaders() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        this.app.use(cors());

        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        })
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

    loadRouters() {
        this.fs.readdir('./routers', (err, files) => {
            for (let file of files.filter(item => item.includes('.js'))) {
                let router = new (require(`./routers/${file}`))();
                this.app.use(`/${file.split('.')[0]}`, router.router);
            }
        })
    }

    loadRequests() {
        this.app.post('/accounts', async (req, res) => {
            res.send(await this.AccountInfo.getAccountInfo());
        });

        this.app.post('/activity', async (req, res) => {
            res.send(await this.AccountInfo.getAccountActivity());
        });

        this.app.post('/auth', (req, res) => {
            res.send(this.AccountInfo.getAuth(req.body));
        });
    }

    start() {
        // * Headers
        this.loadHeaders();

        // * Dist
        this.loadDist();

        // * Main Requests
        this.loadRequests();

        // * Routers
        this.loadRouters();

        // * Images
        let pathImages = `${__dirname}/images`;
        this.fs.access(pathImages, err => err ? this.fs.mkdirSync(pathImages) : null);
        this.app.use('/images', this.express.static(pathImages));

        // * Server
        this.server = this.app.listen(PORT, () => {
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