const Main = require('../index.js');

module.exports = class Router extends Main {
    constructor() {
        super({ name: 'projects' });

        this.router = this.express.Router();

        this.routers();

        this.pathFile = this.path.join(__dirname, `../json/projects.json`);
    }

    routers() {
        this.router.post('/projects', (req, res) => {
            res.send(this.fs.readFileSync(this.pathFile, { encoding: 'utf-8' }));
        });

        this.router.post('/projects/update', async (req, res) => {
            this.fs.writeFile(this.pathFile, JSON.stringify(req.body), { encoding: 'utf-8' }, err => {
                if (err) {
                    console.log(err);
                    return res.send({ status: 418 });
                } else return res.send({ status: 200 });
            })
        });
    }
}