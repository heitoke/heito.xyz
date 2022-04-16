const Main = require('../index.js');

module.exports = class Router extends Main {
    constructor() {
        super({ name: 'content' });

        this.router = this.express.Router();

        this.activity = {};
        this.userOnline = 'online';

        this.routers();
    }

    routers() {

        this.router.post('/', async (req, res) => {
            res.send({ activity: this.activity, userOnline: this.userOnline });
        });

        this.router.post('/update', (req, res) => {
            let { token, data } = req.body;
            if (!this.db.authClient(token)) return res.send({ status: 401 });
            this.activity = data?.activity || this.activity;
            this.userOnline = data?.userOnline || this.userOnline;
            res.send({ status: 200 });
        });

    }
}