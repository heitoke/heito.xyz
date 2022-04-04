const Main = require('../index.js');

module.exports = class Router extends Main {
    constructor() {
        super({ name: 'projects' });

        this.router = this.express.Router();

        this.routers();
    }

    routers() {

        this.router.post('/', (req, res) => {
            let { token } = req.query,
                list = this.db.get('projects').list;
            res.send(this.db.get('users').list.find(item => item.token === token) ? list : list.filter(item => item.public));
        });

        this.router.post('/add', (req, res) => {
            let { token, data } = req.body;
            if (!this.db.authClient(token)) return res.send({ status: 401 });
            this.db.get('projects').add(data);
            res.send({ status: 200 });
        });

        this.router.post('/:projectId', (req, res) => {
            let { token } = req.query,
                { projectId } = req.params,
                project = this.db.get('projects').list.find(item => item.id === projectId);
            res.send(project?.public ? project : this.db.authClient(token) ? project : { status: 404 });
        });

        this.router.post('/:projectId/update', (req, res) => {
            let { token, data } = req.body,
                { projectId } = req.params;
            if (!this.db.authClient(token)) return res.send({ status: 401 });
            res.send(this.db.get('projects').update(projectId, data));
        });

        this.router.post('/:projectId/remove', (req, res) => {
            let { token } = req.query,
                { projectId } = req.params;
            if (!this.db.authClient(token)) return res.send({ status: 401 });
            res.send(this.db.get('projects').remove(projectId));
        });
    }
}