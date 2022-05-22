require("dotenv").config();
const
    // ! Modules
    axios = require('axios').default,
    // ! Web
    express = require('express'),
    bodyParser = require('body-parser'),
    history = require('connect-history-api-fallback'),
    multer = require('multer'),
    { PORT = 8081 } = process.env,
    // ! FileSystem
    fs = require('fs'),
    path = require('path'),
    // ! Firebase
    FCM = require('fcm-node');

class MainServer {
    constructor() {
        // * Express
        this.express = express;
        this.app = this.express();
        this.envs = process.env;
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './images/');
            },
            filename: (req, file, cb) => {
                cb(null, new Date().toISOString() + file.originalname);
            }
        }) // dest: 'images/', storage: this.storage
        this.upload = multer({  });

        // * FileSystem
        this.fs = fs;

        // * Plugins
        this.db = new (require('./plugins/FileSystem.js'))();
        this.spotify = new (require('./plugins/Spotify.js'))();

        // * NPM Modules
        this.path = path;
        this.axios = axios;

        // * Objects
        this.usersList = {};
        this.banUsers = {};
    }

    getHours(time) {
        return Math.floor(((Date.now() - time) % 86400000) / 3600000);
    }

    loadHeaders() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        this.app.use((req, res, next) => {
            let user = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).replace(/::ffff:/g, '');
			if (this.banUsers[user]) return res.send({ status: 429, blocked: true, message: `You are blocked for 5 minutes :#` });
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            if (this.usersList[user] >= 50) {
                this.banUsers[user] = true;
                console.log(`Ban ${user}`);
                return setTimeout(() => delete this.banUsers[user], 300 * 1000);
            } else {
                this.usersList[user] ? this.usersList[user]++ : this.usersList[user] = 1;
                setTimeout(() => this.usersList[user] = 0, 10000);
            }
			next();
        })
    }

    loadDist() {
        let dir = path.join(__dirname, '../web/dist');
        console.log(dir);
        this.fs.access(dir, err => {
            if (err) return console.log('No dist directory :(');
            const staticFileMiddleware = this.express.static(dir);
            this.app.use(staticFileMiddleware);
            this.app.use(history({ disableDotRule: true, verbose: true }));
            this.app.use(staticFileMiddleware);
        });
    }

    loadRouters(path, name = '') {
        this.fs.readdir(path, (err, files) => {
            for (let file of files.filter(item => !item.includes('.off') && item.includes('.js'))) {
                let router = new (require(`${path}/${file}`))();
                this.app.use(`${name}/${file.split('.')[0]}`, router.router);
            }
        })
    }

    isFolder(name) {
        return this.fs.access(`${__dirname}/${name}`, err => err ? this.fs.mkdirSync(`${__dirname}/${name}`) : null);
    }

    isFiles(files) {
        for (let file of files) {
            this.fs.access(`${__dirname}/json/${file[0]}`, err => err ? this.fs.writeFileSync(`${__dirname}/json/${file[0]}`, file[1], { encoding: 'utf-8' }) : null);
        }
    }

    start() {
        // * Folders && Files
        this.isFolder('json');
        this.isFolder('images');
        this.isFiles([
            ['projects.json', '[]'],
            ['services.json', '[]'],
            ['users.json', '[]'],
            ['content.json', '{}'],
            ['blogs.json', '[]']
        ]);

        // * Headers
        this.loadHeaders();

        // * Routers
        this.loadRouters('./routers');

        // * Load Dist
        this.loadDist();

        this.app.get('/fcm', async (req, res, next) => {
            try {
                let fcm = new FCM("AAAA-R6n1k8:APA91bFngsuhJ_vpq-pZsJucaGuaEGq1xKwIqd6hHqXWwA-lN0B3JzHO_j_jH711lMMojahlqk0X1YUu08p7OzZza7a_R-fp-J9DAJkjVjwK_PuBBTy-Jj7ee7RbPA5ke9f-UCxKozfh");

                let message = {
                    to: 'com.heito.heito',
                    notification: {
                        title: '123',
                        body: '123321'
                    }
                }

                fcm.send(message, (err, responce) => {
                    if (err) next(err);
                    else res.json(responce);
                })
            } catch (err) {
                console.log(err);
            }
        });
        
        this.app.listen(PORT, () => {
            console.log(`[heito.xyz]: http://localhost:${PORT}`);
        });
    }
}

new MainServer().start();

module.exports = MainServer;