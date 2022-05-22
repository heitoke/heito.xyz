const Main = require('../index.js');

module.exports = class Router extends Main {
    constructor() {
        super({ name: 'projects' });

        this.router = this.express.Router();

        this.cache = {
            github: {}
        }

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
            this.db.get('projects').add({ ...data, createAt: Date.now() });
            res.send({ status: 200 });
        });

        this.router.post('/repos', async (req, res) => {
            let { login, page = 1 } = req.query;
            if (!login) return res.send({ status: 401 });
            this.cache.github[login] ? null : this.cache.github[login] = {};
            if (!this.cache.github[login][page] || this.getHours(this.cache.github[login][page]?.date) >= 1 || this.cache.github[login][page]?.error) {
                try {
                    let { data } = await this.axios.get(`https://api.github.com/users/${login}/repos?page=${page}&per_page=100`);
                    this.cache.github[login][page] = { last: Date.now(), data }
                } catch (err) {
                    this.cache.github[login][page] = { last: Date.now(), data: err.response.data, error: true }   
                }
            }
            res.send(this.cache.github[login][page].data);
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