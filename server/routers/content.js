const Main = require('../index.js');

module.exports = class Router extends Main {
    constructor() {
        super({ name: 'content' });

        this.router = this.express.Router();

        this.routers();
    }

    routers() {

        this.router.post('/', async (req, res) => {
            try {
                res.send(JSON.parse(this.fs.readFileSync(this.db.path('content'), { encoding: 'utf-8' })));
            } catch (err) {
                res.send(err);
            }
        });

        this.router.post('/update', (req, res) => {
            let { token, data } = req.body;
            if (!this.db.authClient(token)) return res.send({ status: 401 });
            this.fs.writeFileSync(this.db.path('content'), JSON.stringify(data), { encoding: 'utf-8' });
            res.send({ status: 200 });
        });

    }
}