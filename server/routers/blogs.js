const Main = require('../index.js');

module.exports = class Router extends Main {
    constructor() {
        super({ name: 'blogs' });

        this.router = this.express.Router();

        this.cache = {
            github: {}
        }

        this.routers();
    }

    routers() {

        this.router.post('/', (req, res) => {
            let { token } = req.query,
                list = this.db.get('blogs').list;
            res.send(this.db.authClient(token) ? list : list.filter(item => item.public));
        });

        this.router.post('/add', (req, res) => {
            let { token, data } = req.body;
            if (!this.db.authClient(token)) return res.send({ status: 401 });
            this.db.get('blogs').add({ ...data, createAt: Date.now() });
            res.send({ status: 200 });
        });

        this.router.post('/:blogId', (req, res) => {
            let { token } = req.query,
                { blogId } = req.params,
                project = this.db.get('blogs').list.find(item => item.id === blogId);
            res.send(project?.public ? project : this.db.authClient(token) ? project : { status: 404 });
        });

        this.router.post('/:blogId/update', (req, res) => {
            let { token, data } = req.body,
                { blogId } = req.params;
            if (!this.db.authClient(token)) return res.send({ status: 401 });
            res.send(this.db.get('blogs').update(blogId, data));
        });

        this.router.post('/:blogId/remove', (req, res) => {
            let { token } = req.query,
                { blogId } = req.params;
            if (!this.db.authClient(token)) return res.send({ status: 401 });
            res.send(this.db.get('blogs').remove(blogId));
        });
    }
}