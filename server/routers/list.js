const Main = require('../index.js');

module.exports = class Router extends Main {
    constructor() {
        super({ name: 'list' });

        this.router = this.express.Router();

        this.routers();
    }

    routers() {

        this.router.post('/manga', async (req, res) => {
            try {
                let { type = 0, count = 10000, page = 1 } = req.query,
                    { data } = await this.axios.get(`https://api.remanga.org/api/users/109661/bookmarks/?type=${type}&count=${count}`);
                res.send(data);
            } catch (error) {
                res.send({ status: 404 });
            }
        });

        this.router.post('/anime/:userId/:type/:page', async (req, res) => {
            try {
                let { userId, type = 0, page = 0 } = req.params;
                if (!userId) return res.send({ status: 404 });
                let { data } = await this.axios.get(`https://api.anixart.tv/profile/list/all/${userId}/${type}/${page}`);
                res.send(data);
            } catch (error) {
                res.send({ status: 404 });
            }
        });

    }
}