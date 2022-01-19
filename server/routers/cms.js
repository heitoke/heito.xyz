const Main = require('../index.js');

module.exports = class Router extends Main {
    constructor() {
        super({ name: 'projects' });

        this.router = this.express.Router();

        this.routers();

        this.pathFile = this.path.join(__dirname, `../json/projects.json`);
    }

    routers() {
        this.router.post('/config', async (req, res) => {
            res.send(await this.AccountInfo.getConfig());
        });

        this.router.post('/config/update', async (req, res) => {
            this.AccountInfo.updateConfig(req.body);
            res.send({ status: 200 });
        });

        this.router.post('/accounts', async (req, res) => {
            res.send(await this.AccountInfo.getAccounts());
        });

        this.router.post('/accounts/update', async (req, res) => {
            this.AccountInfo.updateAccounts(req.body);
            res.send({ status: 200 });
        });
    }
}