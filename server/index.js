require("dotenv").config();
const
    // ! Modules
    axios = require('axios').default,
    // ! Web
    express = require('express'),
    bodyParser = require('body-parser'),
    { PORT = 8081 } = process.env,
    // ! FileSystem
    fs = require('fs'),
    path = require('path');

class MainServer {
    constructor() {
        // * Express
        this.express = express;
        this.app = this.express();
        this.envs = process.env;

        // * FileSystem
        this.fs = fs;

        // * Plugins
        this.db = new (require('./plugins/FileSystem.js'))();

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

    msInMin(ms) {
        let min = Math.floor((ms / 1000 / 60) << 0),
            sec = Math.floor((ms / 1000) % 60);
        return `${min}:${`${sec}`.length < 2 ? `0${sec}` : sec}`;
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
            ['users.json', '[]']
        ]);

        // * Headers
        this.loadHeaders();

        // * Routers
        this.loadRouters('./routers');

        // * Load Dist
        // this.app.use('/', this.express.static(`${__dirname}/public`));

        // * Load Images
        this.app.use('/images', this.express.static(`${__dirname}/images`));
        
        this.app.listen(PORT, () => {
            console.log(`[heito.xyz]: http://localhost:${PORT}`);
        });
    }
}

new MainServer().start();

module.exports = MainServer;